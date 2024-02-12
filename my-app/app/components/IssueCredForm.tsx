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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";

const IssueCredForm = () => {
  const [issuerDIDs, setIssuerDIDs] = useState<string[]>([]);
  const [didName, setDidName] = useState<string | undefined>(undefined);
  const [did, setDid] = useState<string>("");
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
      fetchDIDs();
    }
  }, [wallet]);

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

  async function onSubmit(values: z.infer<typeof issueCredFormSchema>) {
    if (isConnected) {
      values.issuer_address = wallet.signer!.address;
      values.issuer_did = did;
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
      // const credHash: string | undefined = await identitySDK!.issueCredential(
      //   _credential
      // );
      const isv = await identitySDK!.verifyDID(
        _credential.issuer_did,
        issuer_address
      );
      const hv = await identitySDK!.verifyDID(
        _credential.holder_did,
        holder_address
      );
      console.log(isv, hv);
      // alert(`Credential stored successfully with hash: ${credHash}`);
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
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    {did ? did : "Choose DID"}
                  </DropdownMenuTrigger>
                  {issuerDIDs.map((did: string) => (
                    <DropdownMenuContent key={did} className="mx-7">
                      {/* <DropdownMenuLabel>Y</DropdownMenuLabel> */}
                      {/* <DropdownMenuSeparator /> */}
                      <DropdownMenuItem onClick={() => setDid(did)}>
                        {did}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  ))}
                </DropdownMenu>
              ) : (
                <FormItem>
                  {/* <FormLabel>Your DID</FormLabel> */}
                  <FormControl>
                    <div>
                      <Input {...field} disabled value="No DID found" />
                      <Accordion type="single" collapsible>
                        <AccordionItem value="item-1">
                          <AccordionTrigger className="text-sm pl-2">
                            Generate
                          </AccordionTrigger>
                          <AccordionContent className="space-y-2 mx-2">
                            <Label>Name</Label>
                            <Input
                              placeholder="i.e. university"
                              value={didName}
                              onChange={(e) => setDidName(e.target.value)}
                              className=""
                            />
                            <Button onClick={generateDid}>Create</Button>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
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
