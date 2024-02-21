import { NavbarLink, links } from "@/lib/utils";
import { ConnectWallet } from "./ConnectWallet";
import Link from "next/link";

const Navbar = () => {
  return (
    <div className="px-[2rem] space-y-10 pb-8 pt-12">
      <div className="flex justify-between items-center">
        <Link
          href={"/"}
          className="text-xl lg:text-4xl md:text-3xl font-semibold text-gray-800"
        >
          ChainFusion Decentralized Identity
        </Link>
        <ConnectWallet />
      </div>
      <div className="flex flex-col md:flex-row gap-4 md:gap-8 justify-center items-center pt-4">
        {links.map((link: NavbarLink, index: number) => (
          <Link
            href={link.href}
            key={index}
            className="text-lg lg:text-xl text-blue-600 hover:underline"
          >
            {link.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Navbar;
