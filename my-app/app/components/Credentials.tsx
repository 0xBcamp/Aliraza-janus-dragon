"use client";

import { IdentityContext, WalletContext } from "@/providers/Providers";
import { useContext, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const Credentials = () => {
  const { identitySDK } = useContext(IdentityContext);
  const [issuedCredentialsCids, setIssuedCredentialsCids] = useState<string[]>(
    []
  );
  const [ownedCredentialsCids, setOwnedCredentialsCids] = useState<string[]>(
    []
  );
  const [issuedCredentials, setIssuedCredentials] = useState<any[]>([]);
  const [ownedCredentials, setOwnedCredentials] = useState<any[]>([]);
  const { wallet } = useContext(WalletContext);
  const { isConnected } = wallet;
  useEffect(() => {
    async function fetchCredentials() {
      try {
        const address: string = wallet.signer!.address;
        const user_dids = await identitySDK!.getDIDs(wallet.signer!.address);
        if (user_dids) {
          const allHCreds: string[] = [];
          const allICreds: string[] = [];

          await Promise.all(
            user_dids.map(async (did: string) => {
              const o_cred: string[] = await identitySDK!.getOwnedCredentials(
                did
              );
              const i_cred: string[] = await identitySDK!.getIssuedCredentials(
                did
              );
              console.log(i_cred, o_cred);
              allHCreds.push(
                ...o_cred.filter((cred) => !allHCreds.includes(cred))
              );
              allICreds.push(
                ...i_cred.filter((cred) => !allICreds.includes(cred))
              );
            })
          );
          setOwnedCredentialsCids(allHCreds);
          setIssuedCredentialsCids(allICreds);
          const hc_data: any[] = await Promise.all(
            allHCreds.map(async (hc: string) => {
              return await identitySDK!.getCredentialData(hc);
            })
          );
          console.log("holded", hc_data);
          const ic_data: any[] = await Promise.all(
            allICreds.map(async (ic: string) => {
              return await identitySDK!.getCredentialData(ic);
            })
          );
          console.log("issued", ic_data);
          setIssuedCredentials(ic_data);
          setOwnedCredentials(hc_data);
        }
      } catch (error) {
        console.log(error);
      }
    }
    if (isConnected) {
      fetchCredentials();
    }
  }, [wallet]);
  return (
    <div className="space-y-12">
      <div className="space-y-3">
        <p className="text-2xl font-medium">Issued Credentials</p>
        <ScrollArea className="h-[350px] rounded-md border p-4">
          {issuedCredentialsCids.length > 0 ? (
            issuedCredentialsCids.map((ic_cid: string, i: number) => (
              <Dialog key={ic_cid}>
                <DialogTrigger>
                  <Card className="cursor-pointer">
                    <CardContent className="py-3 h-auto">
                      <p className="break-all font-mono">{ic_cid}</p>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent className="p-4">
                  {issuedCredentials.length > 0
                    ? Object.entries(issuedCredentials[i]).map(
                        ([key, value]) => (
                          <p key={key} className="break-all font-mono">
                            <span className="font-bold">{key}</span>:{" "}
                            {String(value)}
                          </p>
                        )
                      )
                    : null}
                </DialogContent>
              </Dialog>
            ))
          ) : (
            <p className="text-2xl font-medium text-gray-700 opacity-50 pt-2">
              No Issued Credentials
            </p>
          )}
        </ScrollArea>
      </div>
      <div className="space-y-3">
        <p className="text-2xl font-medium">Owned Credentials</p>
        <div className="pt-2">
          <ScrollArea className="h-[350px] rounded-md border p-4">
            {ownedCredentialsCids.length > 0 ? (
              ownedCredentialsCids.map((oc_cid: string, i: number) => (
                <Dialog key={oc_cid}>
                  <DialogTrigger>
                    <Card className="cursor-pointer">
                      <CardContent className="py-3 h-auto">
                        <p className="break-all font-mono">{oc_cid}</p>
                      </CardContent>
                    </Card>
                  </DialogTrigger>
                  <DialogContent className="p-4">
                    {ownedCredentials.length > 0
                      ? Object.entries(ownedCredentials[i]).map(
                          ([key, value]) => (
                            <p key={key} className="break-all font-mono">
                              <span className="font-bold">{key}</span>:{" "}
                              {String(value)}
                            </p>
                          )
                        )
                      : null}
                  </DialogContent>
                </Dialog>
              ))
            ) : (
              <p className="text-2xl font-medium text-gray-700 opacity-50 pt-2">
                No Holded Credentials
              </p>
            )}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default Credentials;
