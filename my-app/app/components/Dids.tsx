"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IdentityContext, WalletContext } from "@/providers/Providers";
import { Label } from "@radix-ui/react-label";
import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";

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
        toast.success("DID created successfully!");
      } catch (e) {
        toast.error("Failed to create DID");
        console.log(e);
      }
    } else {
      toast("Connect Wallet");
    }
  };

  useEffect(() => {
    async function fetchDIDs() {
      const user_dids: string[] | undefined = await identitySDK!.getDIDs(
        wallet.signer!.address
      );
      setDids(user_dids || []);
      console.log(user_dids);
    }
    if (isConnected) {
      fetchDIDs();
    }
  }, [wallet]);
  return (
    <div className="space-y-12">
      <div className="space-y-3">
        <p className="pb-4 text-2xl font-medium">Create Your Identifier</p>
        <Label className="pb-1">Name</Label>
        <Input
          placeholder="i.e. university"
          value={didName}
          onChange={(e) => setDidName(e.target.value)}
          className=""
        />
        <div className="pt-2">
          <Button onClick={generateDid} className="">
            Generate DID
          </Button>
        </div>
      </div>
      <div className="gap-4">
        <p className="pb-4 text-2xl font-medium">Your DIDs</p>
        {dids.length > 0 ? (
          <ScrollArea className="h-[350px] rounded-md border p-4">
            {dids.map((did) => (
              <Card key={did} className="flex justify-center ">
                <CardContent className="py-2 px-3 h-auto">
                  <p className="break-all font-mono">{did}</p>
                </CardContent>
              </Card>
            ))}
          </ScrollArea>
        ) : (
          <p className="text-2xl font-medium text-gray-600 opacity-45 self-center">
            No DID Found
          </p>
        )}
      </div>
    </div>
  );
};

export default Dids;
