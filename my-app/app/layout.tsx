import type { Metadata } from "next";
import "./globals.css";
import {
  IdentityContextProvider,
  WalletContextProvider,
} from "@/providers/Providers";
import Navbar from "./components/Navbar";
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>ChainFusion</title>
      </head>
      <body className="bg-gray-100 px-4">
        <WalletContextProvider>
          <IdentityContextProvider>
            <Navbar />
            {children}
          </IdentityContextProvider>
        </WalletContextProvider>
        <Toaster />
      </body>
    </html>
  );
}
