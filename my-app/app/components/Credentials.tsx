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

const Credentials = () => {
  const { identitySDK } = useContext(IdentityContext);
  const [issuedCredentialsCids, setIssuedCredentialsCids] = useState<string[]>(
    []
  );
  const [holdedCredentialsCids, setHoldedCredentialsCids] = useState<string[]>(
    []
  );
  const [issuedCredentials, setIssuedCredentials] = useState<any[]>([]);
  const [holdedCredentials, setHoldedCredentials] = useState<any[]>([]);
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
              const h_cred: string[] = await identitySDK!.getHoldedCredentials(
                did
              );
              const i_cred: string[] = await identitySDK!.getIssuedCredentials(
                did
              );
              console.log(i_cred, h_cred);
              allHCreds.push(
                ...h_cred.filter((cred) => !allHCreds.includes(cred))
              );
              allICreds.push(
                ...i_cred.filter((cred) => !allICreds.includes(cred))
              );
            })
          );
          setHoldedCredentialsCids(allHCreds);
          setIssuedCredentialsCids(allICreds);
          const hc_data: Object[] = await Promise.all(
            allHCreds.map(async (hc: string) => {
              return await identitySDK!.getCredentialData(hc);
            })
          );
          console.log("holded", hc_data);
          const ic_data: Object[] = await Promise.all(
            allICreds.map(async (ic: string) => {
              return await identitySDK!.getCredentialData(ic);
            })
          );
          console.log("issued", ic_data);
          setIssuedCredentials(ic_data);
          setHoldedCredentials(hc_data);
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
    <div>
      <div>
        <p className="text-2xl font-medium">Issued Credentials</p>
        {issuedCredentialsCids.length > 0 ? (
          issuedCredentialsCids.map((ic_cid: string, i: number) => (
            <Dialog>
              <DialogTrigger>
                <Card key={ic_cid}>
                  <CardContent className="pt-3 h-12">
                    <p className="text-sm md:text-base lg:text-lg xl:text-xl break-words">
                      {ic_cid}
                    </p>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent>
                {Object.entries(issuedCredentials[i]).map(([key, value]) => (
                  <p className="text-sm md:text-base lg:text-lg xl:text-xl break-words">
                    {key}: {String(value)}
                  </p>
                ))}
              </DialogContent>
            </Dialog>
          ))
        ) : (
          <p className="text-2xl font-medium text-gray-700 opacity-50 pt-[0.5rem]">
            {" "}
            No Issued Credentials
          </p>
        )}
      </div>
      <div>
        <p className="text-2xl font-medium pt-[4rem]">Holded Credentials</p>
        {holdedCredentialsCids.length > 0 ? (
          holdedCredentialsCids.map((hc_cid: string, i: number) => (
            <Dialog>
              <DialogTrigger>
                <Card key={hc_cid}>
                  <CardContent className="pt-3 h-12">
                    <p className="text-sm md:text-base lg:text-lg xl:text-xl break-words">
                      {hc_cid}
                    </p>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent>
                {Object.entries(holdedCredentials[i]).map(([key, value]) => (
                  <p className="text-sm md:text-base lg:text-lg xl:text-xl break-words">
                    {key}: {String(value)}
                  </p>
                ))}
              </DialogContent>
            </Dialog>
          ))
        ) : (
          <p className="text-2xl font-medium text-gray-700 opacity-50 pt-[0.5rem]">
            {" "}
            No Holded Credentials
          </p>
        )}
      </div>
    </div>
  );
};

export default Credentials;
