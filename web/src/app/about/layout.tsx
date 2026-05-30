import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chi siamo",
  description: "L'atelier Kwell. Dal 2003 progettiamo attrezzature professionali in Italia.",
  alternates: { canonical: "/about" },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
