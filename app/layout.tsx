import type { Metadata } from "next";
import FirstTimeWalkthrough from "../components/FirstTimeWalkthrough";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Molding Coach",
  description: "Injection molding troubleshooting and coaching assistant.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <FirstTimeWalkthrough />
      </body>
    </html>
  );
}
