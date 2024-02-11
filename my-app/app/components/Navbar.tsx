import { NavbarLink, links } from "@/lib/utils";
import { ConnectWallet } from "./ConnectWallet";
import Link from "next/link";

const Navbar = () => {
  return (
    <div className="p-[2.4rem] space-y-10">
      <div className="flex justify-between">
        <p className="lg:text-4xl text-3xl font-semibold ">
          ChainFusion Decentralized Identity
        </p>
        <ConnectWallet />
      </div>
      <div className="flex gap-x-8 items-center justify-center">
        {links.map((link: NavbarLink, index: number) => (
          <Link href={link.href} key={index}>
            {link.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Navbar;
