import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display, Caveat } from "next/font/google";
import { Toaster } from "react-hot-toast";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Le Petit Anglais — Learn English Among the Stars",
    template: "%s | Le Petit Anglais",
  },
  description:
    "An immersive English learning journey inspired by The Little Prince. Travel through planets, master the language, and discover what makes us human.",
  keywords: ["english learning", "online english", "CEFR", "interactive lessons", "live classes"],
  authors: [{ name: "Le Petit Anglais" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Le Petit Anglais — Learn English Among the Stars",
    description: "Travel through planets and master English through story and wonder.",
    siteName: "Le Petit Anglais",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Le Petit Anglais",
    description: "English learning reimagined through wonder and storytelling.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#8B5CF6" },
    { media: "(prefers-color-scheme: dark)", color: "#8B5CF6" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`
          ${inter.variable} ${playfair.variable} ${caveat.variable}
          font-body antialiased bg-landing-bg text-landing-text transition-colors duration-300
        `}
      >
        <SmoothScroll>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
            className: "font-body text-sm",
            style: {
              background: "#ffffff",
              color: "#4B4B4B",
              border: "2px solid #E5E5E5",
              borderBottomWidth: "4px",
              borderBottomColor: "#8B5CF6",
              borderRadius: "16px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
            },
            success: {
              iconTheme: { primary: "#FFC800", secondary: "#4B4B4B" },
            },
          }}
        />
        </SmoothScroll>
      </body>
    </html>
  );
}
