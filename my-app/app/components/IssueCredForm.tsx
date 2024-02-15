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
  const [credFormFields, setCredFormFields] = useState<any>({});
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

  const generateDid = async (e: any) => {
    e.preventDefault();
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

  const handleAddField = (e: any) => {
    e.preventDefault();
    const updatedCredForm = { ...credFormFields, "": "" };
    setCredFormFields(updatedCredForm);
  };

  const handleFieldKeyChange = (index: number, new_key: string) => {
    // remove the space if there's any in the key
    new_key = new_key.replace(/\s/g, "_");
    // removing the field on the provided index
    const entries = Object.entries(credFormFields);
    entries.splice(index, 1);
    const deletedFieldObj = Object.fromEntries(entries);
    const updatedObj = Object.assign(deletedFieldObj, {
      ...deletedFieldObj,
      [new_key]: "",
    });
    setCredFormFields(updatedObj);
  };

  const handleFieldValueChange = (index: any, value: string, key: string) => {
    const updatedFields = { ...credFormFields };
    updatedFields[key] = value;
    setCredFormFields(updatedFields);
  };

  const handleRemoveField = (index: number) => {
    console.log(index);
    const updatedFields = { ...credFormFields };
    // Get the keys of the object
    const keys = Object.keys(updatedFields);
    // Check if the index is valid
    if (index < 0 || index >= keys.length) {
      console.error("Index is out of range");
      return;
    }
    // Remove the key at the specified index
    const deleteKey = keys[index];
    delete updatedFields[deleteKey];
    // Update the state with the new object
    setCredFormFields(updatedFields);
    // Log the updated state (it may not be immediately updated)
    console.log(updatedFields);
  };

  async function onSubmit(values: z.infer<typeof issueCredFormSchema>) {
    if (isConnected) {
      values.issuer_address = wallet.signer!.address;
      values.issuer_did = did;
      values.credential = credFormFields;
      console.log(values);
      const {
        holder_address,
        holder_did,
        issuer_did,
        credential,
        issuer_address,
      } = values;
      const _credential: Credential = {
        credential: JSON.stringify(credential),
        holder_address: holder_address,
        holder_did: holder_did,
        issuer_address: issuer_address,
        issuer_did: issuer_did,
      };
      console.log(_credential, _credential.credential);
      try {
        const credHash: string | undefined = await identitySDK!.issueCredential(
          _credential
        );
        alert(`Credential stored successfully with hash: ${credHash}`);
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Connect Wallet");
    }
  }

  return (
    <div className="p-4 md:p-8">
      <Form {...issueCredForm}>
        <form
          onSubmit={issueCredForm.handleSubmit(onSubmit)}
          className="space-y-8 md:flex md:flex-wrap"
        >
          <FormField
            control={issueCredForm.control}
            name="issuer_address"
            render={({ field }) => (
              <FormItem className="md:w-1/2 px-3">
                <FormLabel>Your Address</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled
                    value={
                      isConnected ? wallet.signer!.address : "Connect Wallet"
                    }
                    className="w-full"
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
                      {/* <DropdownMenuLabel></DropdownMenuLabel> */}
                      {/* <DropdownMenuSeparator /> */}
                      <DropdownMenuItem onClick={() => setDid(did)}>
                        {did}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  ))}
                </DropdownMenu>
              ) : (
                <FormItem className="md:w-1/2">
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
              <FormItem className="md:w-1/2 px-3">
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
              <FormItem className="md:w-1/2">
                <FormLabel>Holder DID</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* <FormField
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
          /> */}
          <FormField
            control={issueCredForm.control}
            name="credential"
            render={({ field }) => (
              <FormItem className="md:w-1/2 lg:px-3 px-0">
                <FormLabel>Credential</FormLabel>
                <div>
                  {Object.keys(credFormFields).map(
                    (key: string, index: number) => (
                      <div key={index} className="flex gap-x-3 pb-2">
                        <Input
                          className=""
                          type="text"
                          value={key}
                          onChange={(e) =>
                            handleFieldKeyChange(index, e.target.value)
                          }
                          placeholder="Field Name"
                        />
                        <Input
                          type="text"
                          value={credFormFields[key]}
                          onChange={(e) =>
                            handleFieldValueChange(index, e.target.value, key)
                          }
                          placeholder="Field Value"
                        />
                        <Button
                          type="button"
                          onClick={() => handleRemoveField(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    )
                  )}
                  <div className="space-y-4">
                    <div className="flex flex-col w-1/4 gap-y-3 pt-2">
                      <Button onClick={handleAddField}>Add Field</Button>
                    </div>
                    <div className="p-4 bg-gray-100 rounded-md shadow-md">
                      <p className="text-xl font-semibold mb-4">
                        Your Credential
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.keys(credFormFields).map((key: string) => (
                          <div className="flex gap-x-4" key={key}>
                            <p className="font-semibold">{key}</p>
                            <p>{credFormFields[key]}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </FormItem>
            )}
          />
          <div className="w-1/3 gap-y-3">
            <Button type="submit" className="px-8 py-1">
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default IssueCredForm;
