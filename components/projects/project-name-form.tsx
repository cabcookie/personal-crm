import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit } from "lucide-react";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface ProjectNameFormProps {
  projectName: string;
  onUpdate: (projectName: string) => void;
}

const FormSchema = z.object({
  projectName: z.string(),
});

const ProjectNameForm: FC<ProjectNameFormProps> = ({
  projectName,
  onUpdate,
}) => {
  const [formOpen, setFormOpen] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      projectName,
    },
  });

  const onOpenChange = (open: boolean) => {
    if (!open) form.reset();
    setFormOpen(open);
  };

  const handleSubmit = (data: z.infer<typeof FormSchema>) => {
    setFormOpen(false);

    onUpdate(data.projectName);
  };

  return (
    <Form {...form}>
      <form>
        <Dialog open={formOpen} onOpenChange={onOpenChange}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Edit className="w-4 h-4" />
              Edit Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Project {projectName}</DialogTitle>
              <DialogDescription>
                Update information about the project.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 mx-1">
              <FormField
                control={form.control}
                name="projectName"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Project Name…" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="gap-2 mx-1">
              <Button onClick={form.handleSubmit(handleSubmit)}>
                Save changes
              </Button>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </form>
    </Form>
  );
};

export default ProjectNameForm;
