import type { Metadata } from "next";

import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import NavBar from "@/components/NavBar";
const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Course Catalog",
  description: "Advanced Web Technologies Lab 1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className="antialiased p-8 max-w-4xl mx-auto flex flex-col gap-8 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50">
        <NavBar />
        <main>{children}</main>
      </body>
    </html>
  );
}
