"use client";
import { useContext, useEffect, useState } from "react";
import { ethers, toNumber } from "ethers";
import { IdentityContext, WalletContext } from "@/providers/Providers";
import { Button } from "@/components/ui/button";
import { DecentralizeIdentity } from "cf-identity";
import { toast } from "sonner";

export function ConnectWallet() {
  const { identitySDK, setIdentitySDK } = useContext(IdentityContext);
  const { wallet, setWallet } = useContext(WalletContext);
  const { isConnected } = wallet;

  const handleConnect = async () => {
    if ((window as any).ethereum == undefined) {
      toast("Metamask is not installed!");
    } else {
      try {
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        const signer = await provider.getSigner();
        if (toNumber((await provider.getNetwork()).chainId) !== 80001) {
          toast("Connect to Mumbai Network");
        } else {
          setWallet({
            provider: provider,
            signer: signer,
            isConnected: true,
          });
          const decentralizedIdentity: DecentralizeIdentity =
            new DecentralizeIdentity(
              signer,
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDkwMzliYjAyZmVERTdGZjlhMTM2NDkzQzlFOTg5MmNjYjFEZDdEMGMiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY5NDM5ODc1OTExNCwibmFtZSI6ImdlbmVyYXRlX2NpZCJ9.qH_uhaxfejq21q7ZRzr03V1V7EwPxOm9QHBRSGXUxYs"
            );
          setIdentitySDK(decentralizedIdentity);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    handleConnect();
  }, []);

  return (
    <div>
      <Button onClick={handleConnect}>
        {isConnected ? "Connected" : "Connect Wallet"}
      </Button>
    </div>
  );
}
