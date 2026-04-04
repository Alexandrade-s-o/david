import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display, Caveat } from "next/font/google";
import { Toaster } from "react-hot-toast";
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
    { media: "(prefers-color-scheme: light)", color: "#2e1065" },
    { media: "(prefers-color-scheme: dark)", color: "#2e1065" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`
          ${inter.variable} ${playfair.variable} ${caveat.variable}
          font-body antialiased bg-[#2e1065] text-white transition-colors duration-300
        `}
      >
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            className: "font-body text-sm",
            style: {
              background: "#3b1482",
              color: "#fff",
              border: "2px solid #fbbf24",
              borderRadius: "16px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
            },
            success: {
              iconTheme: { primary: "#fbbf24", secondary: "#2e1065" },
            },
          }}
        />
      </body>
    </html>
  );
}
