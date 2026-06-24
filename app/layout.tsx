import type { Metadata } from "next";
import BeginnerLearningFooter from "../components/BeginnerLearningFooter";
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
        <BeginnerLearningFooter />
        <FirstTimeWalkthrough />
      </body>
    </html>
  );
}
