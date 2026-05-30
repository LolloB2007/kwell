import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termini di servizio",
  description: "Condizioni generali di vendita e termini di utilizzo.",
  alternates: { canonical: "/terms" },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
