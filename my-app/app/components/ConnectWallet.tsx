"use client";
import { useContext, useState } from "react";
import { ethers, toNumber } from "ethers";
import { IdentityContext, WalletContext } from "@/providers/Providers";
import { Button } from "@/components/ui/button";
import { DecentralizeIdentity } from "cf-identity";

export function ConnectWallet() {
  const { identitySDK, setIdentitySDK } = useContext(IdentityContext);
  const { wallet, setWallet } = useContext(WalletContext);
  const { isConnected } = wallet;

  const handleConnect = async () => {
    if ((window as any).ethereum == undefined) {
      alert("Metamask is not installed!");
    } else {
      try {
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        const signer = await provider.getSigner();
        toNumber((await provider.getNetwork()).chainId) !== 80001
          ? alert("Connect to Mumbai Network")
          : setWallet({
              provider: provider,
              signer: signer,
              isConnected: true,
            });
        const decentralizedIdentity = new DecentralizeIdentity(
          signer,
          "0Wvz5s13JbRDMHxCaf-v-r-ivOpbwN-6SeUTaHBZ8ex6zRNdUeJU1aH9IYquhe3cQyCFcoulDGJl9IH8rnRLjw"
        );
        setIdentitySDK(decentralizedIdentity);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div>
      <Button onClick={handleConnect}>
        {isConnected ? "Conneced" : "Connect Wallet"}
      </Button>
    </div>
  );
}
