import { Geist, Geist_Mono } from "next/font/google";
import "/styles/globals.css";
import Navbar from "./main/Navbar";
import ReduxProvider from "./redux-provider"; // ✅ use this
import Footer from "./main/Footer";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Kartenity | Online Shopping for Electronics, Fashion & More",
  description:
    "Shop online at Kartenity for the latest electronics, fashion, home essentials, and more. Fast delivery, secure payments, and easy returns.",
  keywords: [
    "Kartenity",
    "online shopping",
    "ecommerce",
    "buy electronics",
    "fashion store",
    "online marketplace",
    "best deals",
    "shop online India",
  ],
  openGraph: {
    title: "Kartenity | Online Shopping for Electronics, Fashion & More",
    description:
      "Discover a wide range of products at Kartenity — your go-to online marketplace for electronics, fashion, home essentials, and beyond.",
    url: "https://kartenity.vercel.app",
    siteName: "Kartenity",
    images: [
      {
        url: "/logo.png", // replace with your deployed logo or banner
        width: 1200,
        height: 630,
        alt: "Kartenity Logo",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  metadataBase: new URL("https://kartenity.onrender.com"),
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider>
          <Navbar />
          {children}
          <SpeedInsights />
          <Footer />
        </ReduxProvider>
      </body>
    </html>
  );
}
