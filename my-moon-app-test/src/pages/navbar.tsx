"use client";
import {Link} from "@chakra-ui/next-js";
import React from "react";
import { Button, Menu, MenuButton, MenuItem, MenuList, useTheme } from "@chakra-ui/react";

const Navbar = ({ Login }: { Login: React.ComponentType }) => {
  const theme = useTheme();

  return (
    <>
      <nav className="bg-gradient-to-r from-f7a219 via-f49258 to-259ff3 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-black font-bold text-xl">Chainfusion</div>
          <ul className="flex space-x-4">
            <li>
              <Link href="/" className="text-black hover:text-gray-300">
                Home
              </Link>
            </li>
            <li>
              <Link href="/team" className="text-black hover:text-gray-300">
                Team
              </Link>
            </li>
            <li>
              <Link href="/" className="text-black hover:text-gray-300">
                Account Abstraction
              </Link>
            </li>
            <li>
              <Link href="/" className="text-black hover:text-gray-300">
                Decentralized ID
              </Link>
            </li>
            <li>
              <Menu>
                <MenuButton
                  as={Button}
                  bg="transparent"
                  color="black"
                  _hover={{ bg: "transparent" }}
                >
                  Services
                </MenuButton>
                <MenuList>
                  <MenuItem><Login /></MenuItem>
                </MenuList>
              </Menu>
            </li>
          </ul>
        </div>
        <hr className="border-black border-t-1 my-2" />
      </nav>
    </>
  );
};

export default Navbar;