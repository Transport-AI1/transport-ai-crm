import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Transport AI | CRM empresarial",
  description:
    "Demo interactiva de CRM empresarial de Transport AI para gestionar clientes, contactos y oportunidades comerciales.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
