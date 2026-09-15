import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Portail ISO 27001",
  description: "Portail web d'analyse des risques selon ISO 27001",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
