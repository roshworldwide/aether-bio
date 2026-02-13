import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // <--- THIS IS THE MISSING LINK

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NEURO-LAWYER",
  description: "Autonomous Defense System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}