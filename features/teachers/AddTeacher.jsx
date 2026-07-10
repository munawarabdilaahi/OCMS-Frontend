import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TeacherForm } from "@/components/teachers/TeacherForm";
export default function AddTeacher() {
    return (<div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
          <ArrowLeft className="h-4 w-4"/>
        </Button>
        <h1 className="text-3xl font-bold">Add New Teacher</h1>
      </div>

      <div className="mt-6">
        <TeacherForm mode="add"/>
      </div>
    </div>);
}
