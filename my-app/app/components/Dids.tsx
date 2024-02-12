"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IdentityContext, WalletContext } from "@/providers/Providers";
import { Label } from "@radix-ui/react-label";
import { useContext, useEffect, useState } from "react";

const Dids = () => {
  const { identitySDK } = useContext(IdentityContext);
  const [dids, setDids] = useState<string[]>([]);
  const { wallet } = useContext(WalletContext);
  const { isConnected } = wallet;
  const [didName, setDidName] = useState("");

  const generateDid = async () => {
    if (isConnected) {
      try {
        const did: string = identitySDK!.createIdentifier(
          didName!,
          wallet.signer!.address
        );
        await identitySDK!.storeDID(did, wallet.signer!.address);
        alert("DID created successfully!");
      } catch (e) {
        console.log(e);
      }
    } else {
      alert("Connect Wallet");
    }
  };

  useEffect(() => {
    async function fetchDIDs() {
      const user_dids = await identitySDK!.getDIDs(wallet.signer!.address);
      setDids(user_dids || []);
      console.log(user_dids);
    }
    if (isConnected) {
      fetchDIDs();
    }
  }, [wallet]);
  return (
    <div>
      <div className="space-y-2">
        <p className="pb-2">Create Your Identifier</p>
        <Label>Name</Label>
        <Input
          placeholder="i.e. university"
          value={didName}
          onChange={(e) => setDidName(e.target.value)}
          className=""
        />
        <Button onClick={generateDid}>Generate DID</Button>
      </div>
    </div>
  );
};

export default Dids;
