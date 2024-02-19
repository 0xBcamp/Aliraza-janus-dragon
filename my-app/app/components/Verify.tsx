"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IdentityContext, WalletContext } from "@/providers/Providers";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useContext, useState } from "react";
import { toast } from "sonner";

const Verify = () => {
  const { identitySDK } = useContext(IdentityContext);
  const { wallet } = useContext(WalletContext);
  const [isVerified, setIsVerified] = useState<boolean | undefined>(undefined);
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)
      return params.toString()
    },
    [searchParams]
  )

  const verifyCredential = async () => {
    if (wallet.isConnected) {
      try {
        const cid = searchParams.get("cid");
        if (cid) {
          const isVerified: boolean = await identitySDK!.verifyCredential(wallet.signer!.address, cid);
          setIsVerified(isVerified);
          console.log(isVerified);
        } else {
          toast.error("Invalid Credential CID");
        }
      } catch (error) {
        setIsVerified(false);
        console.log(error);
        toast.error(String(error));
      }
    } else {
      toast("Connect Wallet");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center space-y-5">
      <Label>Enter Credential CID</Label>
      <div className="flex justify-between space-x-6">
        <Input
          className="w-[24rem]"
          onChange={(e) =>
            router.push(pathName + '?' + createQueryString('cid', e.target.value))
          }
        />
        <Button className="w-28" onClick={verifyCredential}>
          Verify
        </Button>
      </div>
      {isVerified && (
        <p className="text-lg text-green-500">
          Credential {searchParams.get("cid")} is{" "}
          {isVerified ? "valid" : "invalid"}.
        </p>
      )}
    </div>
  );
};

export default Verify;
