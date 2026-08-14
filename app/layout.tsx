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
    default: "Salon ERP Docs",
    template: "%s · Salon ERP Docs",
  },
  description:
    "Salon ERP documentation — a multi-branch salon management system. User guides, developer reference, and architecture for billing, inventory, attendance, and reporting.",
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
