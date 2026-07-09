import type { Metadata } from "next";
import { Fraunces, Source_Sans_3, Geist_Mono } from "next/font/google";
import { AppFooter, AppHeader } from "@/components/layout/AppShell";
import { ExperimentsProvider } from "@/lib/experiments-context";
import "./globals.css";

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const body = Source_Sans_3({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Experiment Decision Log",
  description:
    "Transforme experimentos em decisões rastreáveis: hipótese → evidência → decisão → aprendizado.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${display.variable} ${body.variable} ${geistMono.variable} antialiased`}
      >
        <ExperimentsProvider>
          <div className="flex min-h-screen flex-col">
            <AppHeader />
            <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
              {children}
            </main>
            <AppFooter />
          </div>
        </ExperimentsProvider>
      </body>
    </html>
  );
}
