import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ClientManager Pro - Plataforma de Gestão de Clientes",
  description:
    "Plataforma completa para gerenciar clientes com alertas de vencimento e dashboard inteligente",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.className} !overflow-x-hidden`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
