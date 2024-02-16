import React, { Suspense, useContext } from "react";
import Verify from "../components/Verify";

const page = () => {
  return (
    <div className="p-4 lg:p-8">
      <p className="text-4xl lg:text-5xl font-semibold text-center pb-8">
        Verify Credentials
      </p>
      <div className="pt-[2.5rem]">
        <Suspense fallback={<div></div>}>
          <Verify />
        </Suspense>
      </div>
    </div>
  );
};

export default page;
