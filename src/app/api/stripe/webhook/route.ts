/**
 * Stripe Webhook Handler
 * POST /api/stripe/webhook
 *
 * Handles subscription lifecycle events:
 * - checkout.session.completed  → activate subscription
 * - customer.subscription.updated → update plan
 * - customer.subscription.deleted → downgrade to free
 * - invoice.payment_failed → notify user
 */

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;

// Map Stripe price IDs to subscription plans
const PRICE_TO_PLAN: Record<string, string> = {
  price_explorer_monthly:   "explorer",
  price_explorer_yearly:    "explorer",
  price_astronaut_monthly:  "astronaut",
  price_astronaut_yearly:   "astronaut",
  price_universe_monthly:   "universe",
  price_universe_yearly:    "universe",
};

export async function POST(req: NextRequest) {
  const body      = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, WEBHOOK_SECRET);
  } catch (err) {
    console.error("[Stripe webhook] Signature verification failed:", err);
    return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 });
  }

  try {
    switch (event.type) {
      // ── New subscription created ──────────────────────────────
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId  = session.metadata?.userId;
        if (!userId || !session.customer || !session.subscription) break;

        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
        const priceId      = subscription.items.data[0]?.price.id;
        const plan         = PRICE_TO_PLAN[priceId] ?? "free";
        const expiresAt    = new Date(subscription.current_period_end * 1000);

        await updateDoc(doc(db, "users", userId), {
          subscription:              plan,
          subscriptionExpiresAt:     expiresAt,
          stripeCustomerId:          session.customer as string,
          stripeSubscriptionId:      session.subscription as string,
          updatedAt:                 serverTimestamp(),
        });
        break;
      }

      // ── Subscription changed (upgrade / downgrade) ────────────
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.userId;
        if (!userId) break;

        const priceId  = sub.items.data[0]?.price.id;
        const plan     = PRICE_TO_PLAN[priceId] ?? "free";
        const expiresAt = new Date(sub.current_period_end * 1000);

        await updateDoc(doc(db, "users", userId), {
          subscription:          plan,
          subscriptionExpiresAt: expiresAt,
          updatedAt:             serverTimestamp(),
        });
        break;
      }

      // ── Subscription cancelled ────────────────────────────────
      case "customer.subscription.deleted": {
        const sub    = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.userId;
        if (!userId) break;

        await updateDoc(doc(db, "users", userId), {
          subscription:          "free",
          subscriptionExpiresAt: null,
          updatedAt:             serverTimestamp(),
        });
        break;
      }

      // ── Payment failed (notify user via Firestore) ────────────
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const userId  = (invoice.subscription_details?.metadata?.userId as string) ?? null;
        if (!userId) break;

        // You could write a notification document here:
        // await addDoc(collection(db, `users/${userId}/notifications`), { type: "payment_failed", ... });
        console.warn(`[Stripe] Payment failed for user ${userId}`);
        break;
      }

      default:
        // Ignore unhandled events
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[Stripe webhook] Handler error:", err);
    return NextResponse.json({ error: "Handler error" }, { status: 500 });
  }
}
