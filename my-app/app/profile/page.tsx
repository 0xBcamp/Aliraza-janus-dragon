import Credentials from "../components/Credentials";
import Dids from "../components/Dids";

const profile = () => {
  return (
    <div className="p-[1rem]">
      <p className="lg:text-4xl text-3xl font-semibold text-center">
        Your Profile
      </p>
      <Credentials />
      <Dids />
    </div>
  );
};

export default profile;
