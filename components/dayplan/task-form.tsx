import { type Schema } from "@/amplify/data/resource";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import ProjectSelector from "../ui-elements/project-selector";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { useToast } from "../ui/use-toast";

const FormSchema = z.object({
  todo: z
    .string({
      required_error: "A todo description is required",
    })
    .min(3, "Please use a minimum of 3 characters."),
  projectId: z.string(),
});

type TaskFormProps = {
  createTodo: (
    todo: string,
    projectId?: string
  ) => Promise<Schema["DayPlanTodo"]["type"] | undefined>;
};

const TaskForm: FC<TaskFormProps> = ({ createTodo }) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { todo: "", projectId: "" },
  });
  const { toast } = useToast();

  const handleSubmit = ({ todo, projectId }: z.infer<typeof FormSchema>) => {
    toast({ title: "You created a new task", description: "new task created" });
    createTodo(todo, projectId !== "" ? projectId : undefined);
    form.reset();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-2 w-full"
      >
        <FormField
          control={form.control}
          name="todo"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input placeholder="Add a task…" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="projectId"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <ProjectSelector
                  value={field.value}
                  onChange={(projectId: string | null) =>
                    projectId && form.setValue("projectId", projectId)
                  }
                  allowCreateProjects
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Add task</Button>
      </form>
    </Form>
  );
};

export default TaskForm;
