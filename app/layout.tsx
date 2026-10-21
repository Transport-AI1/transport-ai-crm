import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CRM Empresarial | Transport AI",
  description:
    "Demostración interactiva de un CRM empresarial de Transport AI para gestionar clientes, oportunidades comerciales, tareas y seguimiento.",
  applicationName: "Transport AI CRM",
  robots: {
    index: false,
    follow: false,
  },
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
