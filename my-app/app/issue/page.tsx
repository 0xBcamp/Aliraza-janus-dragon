import IssueCredForm from "../components/IssueCredForm";

const page = () => {
  return (
    <div className="p-[1rem]">
      <p className="lg:text-4xl text-3xl font-semibold text-center">
        Issue Credentials
      </p>
      <IssueCredForm />
    </div>
  );
};

export default page;
