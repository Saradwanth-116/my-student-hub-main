import TeacherLayout from "@/components/TeacherLayout";
import { Card, CardContent } from "@/components/ui/card";
import { FolderOpen } from "lucide-react";

const TeacherResources = () => {
  return (
    <TeacherLayout>
      <div className="animate-fade-in space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground md:text-3xl">Resources Management</h1>
          <p className="text-muted-foreground">Upload and manage course materials.</p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <FolderOpen className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h2 className="text-xl font-semibold">Coming Soon</h2>
            <p className="text-muted-foreground max-w-sm mt-2">
              The resource management module is currently being built.
            </p>
          </CardContent>
        </Card>
      </div>
    </TeacherLayout>
  );
};

export default TeacherResources;
