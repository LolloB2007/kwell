import type { Metadata } from "next";
import { Anton, Roboto } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ClientProviders } from "@/components/ClientProviders";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Toaster } from "@/components/Toaster";
import { CookieConsent } from "@/components/CookieConsent";

const display = Anton({
  subsets: ["latin", "latin-ext"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

const body = Roboto({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Kwell — Attrezzature professionali per il fitness",
    template: "%s · Kwell",
  },
  description:
    "Attrezzature progettate in Italia per palestre, personal trainer e atleti. Functional, cardio, forza, yoga, boxe, riabilitazione, pavimentazioni.",
  metadataBase: new URL("https://kwell.it"),
  openGraph: {
    title: "Kwell — Attrezzature professionali per il fitness",
    description: "Costruito per la performance. Pensato per durare.",
    type: "website",
    locale: "it_IT",
    siteName: "Kwell",
    images: [{ url: "/brand/hero.jpg", width: 1200, height: 630, alt: "Kwell" }],
  },
  twitter: { card: "summary_large_image", title: "Kwell", description: "Costruito per la performance. Pensato per durare." },
  alternates: { canonical: "/" },
  authors: [{ name: "Kwell S.r.l." }],
  robots: { index: true, follow: true },
};

const THEME_INIT = `(() => {
  try {
    var s = localStorage.getItem('kwell.theme');
    var dark = s ? s === 'dark' : true;
    if (dark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  } catch (e) {
    document.documentElement.classList.add('dark');
  }
})();`;

const ORG_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Kwell",
  legalName: "Kwell S.r.l.",
  url: "https://kwell.it",
  logo: "https://kwell.it/brand/hero.jpg",
  email: "info@kwell.it",
  telephone: "+39 0547 313 288",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Via dei Tessitori 14",
    addressLocality: "Cesena",
    postalCode: "47521",
    addressRegion: "FC",
    addressCountry: "IT",
  },
  sameAs: [],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={`dark ${display.variable} ${body.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSONLD) }}
        />
      </head>
      <body className="bg-ink-900 text-fg antialiased">
        <ClientProviders>
          <SmoothScroll />
          <Nav />
          <main>{children}</main>
          <Footer />
          <LanguageToggle />
          <Toaster />
          <CookieConsent />
        </ClientProviders>
      </body>
    </html>
  );
}
