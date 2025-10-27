import type { Metadata } from "next";
import { AuthProvider } from "@/contexts/AuthContext";
// @ts-ignore - allow side-effect import of CSS without types
import "./globals.css";

export const metadata: Metadata = {
  title: "Vare Web",
  description: "Sistema de ventas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}