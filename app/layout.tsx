import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Molding Mentor AI",
  description: "Injection molding troubleshooting and coaching assistant.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
