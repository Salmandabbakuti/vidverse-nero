import { Geist, Geist_Mono } from "next/font/google";
import Web3Provider from "@/app/components/Web3Provider";
import SiteLayout from "@/app/components/SiteLayout";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});

export const metadata = {
  title: "VidVerse",
  description: "A decentralized video sharing platform powered by NERO Chain"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Web3Provider>
          <SiteLayout>{children}</SiteLayout>
        </Web3Provider>
      </body>
    </html>
  );
}
