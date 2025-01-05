import IPDisplay from "@/components/IPDisplay";
import GitHubLink from "@/components/GitHubLink";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <GitHubLink />
      <IPDisplay />
    </div>
  );
};

export default Index;
