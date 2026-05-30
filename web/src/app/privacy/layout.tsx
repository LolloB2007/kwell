import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Informativa privacy e trattamento dei dati personali.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
