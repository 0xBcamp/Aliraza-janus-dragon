"use client";
import { IdentityContext } from "@/providers/Providers";
import React, { useContext } from "react";

const page = () => {
  const { identitySDK } = useContext(IdentityContext);

  return (
    <div className="p-[1rem]">
      <p className="lg:text-4xl text-3xl font-semibold text-center">
        Verify Credentials
      </p>
    </div>
  );
};

export default page;
