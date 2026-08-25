import type { Metadata } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CmdK } from "@/components/CmdK";
import { UiProvider } from "@/components/ui-context";
import { getSearchIndex } from "@/lib/content";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const bebas = Bebas_Neue({ subsets: ["latin"], weight: "400", variable: "--font-bebas", display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "Marketing Docs",
    template: "%s · Marketing Docs",
  },
  description:
    "S&M Hub documentation — Aureole Group's sales and marketing operations platform. Leads, orders, reporting, and more.",
  icons: {
    icon: "/logo/beforth-mark-black.png",
  },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const searchIndex = await getSearchIndex();

  return (
    <html lang="en" className={`${inter.variable} ${bebas.variable}`}>
      <body className="dot-grid bg-slate-bg font-sans text-navy antialiased">
        <UiProvider>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <div className="flex-1">{children}</div>
            <Footer />
          </div>
          <CmdK index={searchIndex} />
        </UiProvider>
      </body>
    </html>
  );
}
