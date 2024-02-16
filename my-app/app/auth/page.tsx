import { Label } from "@radix-ui/react-label";
import Authorization from "../components/Auth";

const page = () => {
  return (
    <div className="p-[1rem]">
      <div className="pb-[3rem] text-center">
        <p className="lg:text-4xl text-3xl font-semibold pb-[0.5rem]">
          Authorization
        </p>
        <p>Authorize or Revoke access of users to your credentials</p>
      </div>
      <Authorization />
    </div>
  );
};

export default page;
