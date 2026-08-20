import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GZ Pinterest AI Creative Director | Nano Banana Pro Ad Studio",
  description:
    "AI Creative Director that analyzes websites & Play Store apps, mines Pinterest visual trends, and crafts high-converting Nano Banana Pro ad creative prompts for Meta & Google campaigns.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#070a12] text-slate-100 antialiased selection:bg-rose-500/30 selection:text-rose-200">
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl" />
          <div className="absolute top-1/3 -right-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
