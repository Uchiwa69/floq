import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { site } from "@/data/contenu";
import "./globals.css";

// Quatre polices libres, hébergées par Next.js (aucune requête vers Google côté visiteur).
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: "italic",
});
// Police du flocage affiché sur le maillot.
const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: "700",
});

// Référencement : ces données deviennent les balises <title>, <meta> et Open Graph.
// L'image de partage vient des fichiers opengraph-image.jpg et twitter-image.jpg.
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.titre,
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "/",
    siteName: site.nom,
    title: site.titre,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: site.titre,
    description: site.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} ${barlowCondensed.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
