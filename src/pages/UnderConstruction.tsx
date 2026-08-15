import { HardHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

import { useNavigate } from "react-router-dom";

const UnderConstruction = ({ role }: { role: string }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center animate-fade-in">
      <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
        <HardHat className="h-12 w-12 text-primary" />
      </div>
      <h1 className="font-heading text-4xl font-bold text-foreground md:text-5xl">
        {role} Portal
      </h1>
      <p className="mt-4 max-w-[500px] text-lg text-muted-foreground">
        This section is currently under construction. We are building the tools and dashboards required for this role. Check back soon!
      </p>
      <div className="mt-8 flex items-center gap-4">
        <Button onClick={handleLogout}>Sign Out</Button>
      </div>
    </div>
  );
};

export default UnderConstruction;
