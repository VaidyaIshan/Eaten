import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";

const cabinetGrotesk = localFont({
  src: [
    {
      path: "./assets/fonts/Cabinet_Grotesk/CabinetGrotesk-Variable.woff2",
      weight: "100 900", 
      style: "normal",
    },
  ],
  variable: "--font-my-custom",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Eaten",
  description: "Developed By DWIT Software Club 2026",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cabinetGrotesk.variable}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}