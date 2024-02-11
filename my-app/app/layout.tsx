import type { Metadata } from "next";
import "./globals.css";
import {
  IdentityContextProvider,
  WalletContextProvider,
} from "@/providers/Providers";
import { ConnectWallet } from "./components/ConnectWallet";
import Navbar from "./components/Navbar";

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
      <body>
        <WalletContextProvider>
          <IdentityContextProvider>
            <Navbar />
            {children}
          </IdentityContextProvider>
        </WalletContextProvider>
      </body>
    </html>
  );
}
