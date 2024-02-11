"use client";
import { createContext, useState } from "react";
import { JsonRpcProvider, JsonRpcSigner } from "ethers";
import { BrowserProvider } from "ethers";
import { DecentralizeIdentity } from "cf-identity";

type Wallet = {
  provider: JsonRpcProvider | undefined | BrowserProvider;
  signer: JsonRpcSigner | undefined;
  isConnected: boolean;
};

export const WalletContext = createContext({
  wallet: {
    provider: undefined as BrowserProvider | JsonRpcProvider | undefined,
    signer: undefined as JsonRpcSigner | undefined,
    isConnected: false,
  },
  setWallet: (wallet: Wallet) => {},
});

export function WalletContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [wallet, setWallet] = useState<Wallet>({
    provider: undefined,
    signer: undefined,
    isConnected: false,
  });

  return (
    <div>
      <WalletContext.Provider value={{ wallet, setWallet }}>
        {children}
      </WalletContext.Provider>
    </div>
  );
}

export const IdentityContext = createContext({
  identitySDK: undefined as DecentralizeIdentity | undefined,
  setIdentitySDK: (identitySDK: DecentralizeIdentity) => {},
});

export function IdentityContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [identitySDK, setIdentitySDK] = useState<
    DecentralizeIdentity | undefined
  >(undefined);
  return (
    <IdentityContext.Provider value={{ identitySDK, setIdentitySDK }}>
      {children}
    </IdentityContext.Provider>
  );
}
