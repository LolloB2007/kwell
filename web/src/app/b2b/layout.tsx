import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "B2B · Allestimento palestre",
  description: "Progettiamo, forniamo e installiamo spazi training per palestre, personal trainer e centri.",
  alternates: { canonical: "/b2b" },
};

export default function B2BLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
