import { Person } from "@/api/usePerson";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit } from "lucide-react";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";

const FormSchema = z.object({
  name: z.string(),
  howToSay: z.string().optional(),
  dateOfBirth: z.date().optional(),
  dateOfDeath: z.date().optional(),
});

interface OnUpdateProps {
  name: string;
  howToSay?: string;
  dayOfBirth?: Date;
  dayOfDeath?: Date;
}

type PersonUpdateFormProps = {
  person: Person;
  onUpdate: (props: OnUpdateProps) => void;
  formControl?: {
    open: boolean;
    setOpen: (val: boolean) => void;
  };
};

const PersonUpdateForm: FC<PersonUpdateFormProps> = ({
  person,
  onUpdate,
  formControl,
}) => {
  const [formOpen, setFormOpen] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: person.name,
      howToSay: person.howToSay || "",
      dateOfBirth: person.dateOfBirth,
      dateOfDeath: person.dateOfDeath,
    },
  });

  const onOpenChange = (open: boolean) => {
    if (!open) form.reset();
    if (!formControl) setFormOpen(open);
    else formControl.setOpen(open);
  };

  const handleSubmit = (data: z.infer<typeof FormSchema>) => {
    if (!formControl) setFormOpen(false);
    else formControl.setOpen(false);
    onUpdate(data);
  };

  return (
    <Form {...form}>
      <form>
        <Dialog
          open={!formControl ? formOpen : formControl.open}
          onOpenChange={onOpenChange}
        >
          {!formControl && (
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Edit className="w-4 h-4" />
                Edit Person
              </Button>
            </DialogTrigger>
          )}
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Person {person.name}</DialogTitle>
              <DialogDescription>
                Update information about the person.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-80 md:h-[30rem] w-full">
              <div className="space-y-3 mx-1">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Name…" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="howToSay"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>How to say the name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Clarify if not obvious…"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <Calendar
                          mode="single"
                          onSelect={field.onChange}
                          defaultMonth={field.value}
                          selected={field.value}
                          captionLayout="dropdown-buttons"
                          className="w-[17.5rem]"
                          fromYear={1920}
                          toYear={new Date().getFullYear()}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dateOfDeath"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Date of Death</FormLabel>
                      <FormControl>
                        <Calendar
                          mode="single"
                          onSelect={field.onChange}
                          defaultMonth={field.value}
                          selected={field.value}
                          captionLayout="dropdown-buttons"
                          className="w-[17.5rem]"
                          fromYear={1990}
                          toYear={new Date().getFullYear()}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </ScrollArea>
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

export default PersonUpdateForm;
