"use client";

import { IdentityContext, WalletContext } from "@/providers/Providers";
import { useContext, useEffect, useState } from "react";

const Credentials = () => {
  const { identitySDK } = useContext(IdentityContext);
  const [issuedCredentials, setIssuedCredentials] = useState<string[]>([]);
  const [holdedCredentials, setHoldedCredentials] = useState<string[]>([]);
  const { wallet } = useContext(WalletContext);
  const { isConnected } = wallet;

  useEffect(() => {
    async function fetchCredentials() {
      const address: string = wallet.signer!.address;
      const issued_cred: string[] = await identitySDK!.getIssuedCredentials(
        address
      );
      const holded_cred: string[] = await identitySDK!.getHoldedCredentials(
        address
      );
      setIssuedCredentials(issued_cred);
      setHoldedCredentials(holded_cred);
      console.log(issued_cred, holded_cred);
    }
    if (isConnected) {
      fetchCredentials();
    }
  }, [wallet]);
  return <div></div>;
};

export default Credentials;
