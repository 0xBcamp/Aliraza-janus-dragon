"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authFormSchema } from "@/lib/utils";
import { IdentityContext, WalletContext } from "@/providers/Providers";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const Authorization = () => {
  const { wallet } = useContext(WalletContext);
  const { identitySDK } = useContext(IdentityContext);

  const authForm = useForm<z.infer<typeof authFormSchema>>({
    resolver: zodResolver(authFormSchema),
  });

  const authorizeVerifier = async (values: z.infer<typeof authFormSchema>) => {
    try {
      const loadId = toast.loading("Processing...");
      await identitySDK!.authorizeForCredentialAccess(
        values.address,
        values.credential
      );
      toast.dismiss(loadId);
      toast.success("User Authorized Successfully!");
    } catch (error) {
      toast.error(String(error));
    }
  };

  const revokeVerifier = async (values: z.infer<typeof authFormSchema>) => {
    try {
      const loadId = toast.loading("Processing...");
      await identitySDK!.revokeCredentialAccess(
        values.address,
        values.credential
      );
      toast.dismiss(loadId);
      toast.success("User Access Revoked Successfully!");
    } catch (error) {
      toast.error(String(error));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center pb-4">
      <Form {...authForm}>
        <form
          onSubmit={authForm.handleSubmit(authorizeVerifier)}
          className="space-y-8"
        >
          <FormField
            control={authForm.control}
            name="address"
            render={({ field }) => (
              <FormItem className=" px-3">
                <FormLabel>User Address</FormLabel>
                <FormControl>
                  <Input {...field} className="w-[30rem]" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={authForm.control}
            name="credential"
            render={({ field }) => (
              <FormItem className=" px-3">
                <FormLabel>Credential</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="i.e bafkreia3fihrmyytrilxzzad......"
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-x-6 pl-3 items-center justify-center">
            <Button onClick={authForm.handleSubmit(authorizeVerifier)}>
              Authorize
            </Button>
            <Button onClick={authForm.handleSubmit(revokeVerifier)}>
              Revoke
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Authorization;
