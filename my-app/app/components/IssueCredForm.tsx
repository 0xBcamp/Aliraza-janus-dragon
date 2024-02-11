"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { issueCredFormSchema } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useContext, useEffect, useState } from "react";
import { IdentityContext, WalletContext } from "@/providers/Providers";
import { Credential } from "cf-identity";

const IssueCredForm = () => {
  const [issuerDIDs, setIssuerDIDs] = useState<string[]>([]);
  const { identitySDK } = useContext(IdentityContext);
  const { wallet } = useContext(WalletContext);
  const { isConnected } = wallet;
  const issueCredForm = useForm<z.infer<typeof issueCredFormSchema>>({
    resolver: zodResolver(issueCredFormSchema),
  });

  useEffect(() => {
    async function fetchDIDs() {
      const issuer_dids = await identitySDK!.getDIDs(wallet.signer!.address);
      setIssuerDIDs(issuer_dids || []);
      console.log(issuer_dids);
    }
    if (isConnected) {
      console.log("Wallet connected!");
      // fetchDIDs();
    } else {
      console.log("Wallet not connected!");
    }
  }, [wallet]);

  async function onSubmit(values: z.infer<typeof issueCredFormSchema>) {
    if (isConnected) {
      values.issuer_address = wallet.signer!.address;
      console.log(values);
      const {
        holder_address,
        holder_did,
        issuer_did,
        credential,
        issuer_address,
      } = values;
      const _credential: Credential = {
        credential: credential,
        holder_address: holder_address,
        holder_did: holder_did,
        issuer_address: issuer_address,
        issuer_did: issuer_did,
      };
      const credHash: string | undefined = await identitySDK!.issueCredential(
        _credential
      );
      alert(`Credential stored successfully with hash: ${credHash}`);
    } else {
      alert("Connect Wallet");
    }
  }

  return (
    <div className="p-[4rem]">
      <Form {...issueCredForm}>
        <form
          onSubmit={issueCredForm.handleSubmit(onSubmit)}
          className="space-y-8"
        >
          <FormField
            control={issueCredForm.control}
            name="issuer_address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Address</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isConnected}
                    value={
                      isConnected ? wallet.signer!.address : "Connect Wallet"
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={issueCredForm.control}
            name="issuer_did"
            render={({ field }) =>
              // a dropdown for issuer to choose did
              // If no did found {generate_did}
              issuerDIDs.length > 0 ? (
                <div></div>
              ) : (
                <FormItem>
                  <FormLabel>Your DID</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Input {...field} disabled />
                      <p
                        className="text-blue-600 cursor-pointer"
                        onClick={async () => {
                          // const did: string =
                          // await identitySDK!.storeDID(wallet.signer!.address);
                        }}
                      >
                        Generate DID
                      </p>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }
          />
          <FormField
            control={issueCredForm.control}
            name="holder_address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Holder Address</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={issueCredForm.control}
            name="holder_did"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Holder DID</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={issueCredForm.control}
            name="credential"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Credential</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
};

export default IssueCredForm;
