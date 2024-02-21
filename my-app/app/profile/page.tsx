import Credentials from "../components/Credentials";
import Dids from "../components/Dids";

const profile = () => {
  return (
    <div className="p-[1rem]">
      <p className="lg:text-4xl text-3xl font-semibold text-center pb-[3rem]">
        Your Profile
      </p>
      <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-6 pb-[3rem] px-[2rem] pt-[1.5rem]">
        <Dids />
        <Credentials />
      </div>
    </div>
  );
};

export default profile;
