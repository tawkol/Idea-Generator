import type { Metadata } from "next";
import { IdeasProvider } from "@/components/provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Website Idea Generator",
  description:
    "AI-powered tool to transform website ideas into professional sections",
};
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const themeColor = [
  { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  { media: "(prefers-color-scheme: dark)", color: "#000000" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        <IdeasProvider>{children}</IdeasProvider>
      </body>
    </html>
  );
}
