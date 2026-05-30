import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contatti",
  description: "Scrivici, chiamaci o passa dall'officina. Kwell · Cesena, Italia.",
  alternates: { canonical: "/contact" },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
