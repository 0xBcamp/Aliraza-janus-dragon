import { type ClassValue, clsx } from "clsx";
import { JsonRpcProvider, JsonRpcSigner } from "ethers";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { z } from "zod";

export const issueCredFormSchema = z.object({
  issuer_did: z.any(),
  issuer_address: z.any(),
  holder_did: z.string().min(64),
  holder_address: z
    .string()
    .min(42, { message: "Invalid wallet address" })
    .max(42, { message: "Invalid wallet address" }),
  credential: z.any(),
});

export type NavbarLink = {
  name: string;
  href: string;
};

export const links: NavbarLink[] = [
  {
    name: "Issue Credentials",
    href: "/issue",
  },
  {
    name: "Verify Credentials",
    href: "/verify",
  },
  {
    name: "Profile",
    href: "/profile",
  },
];