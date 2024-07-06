import {
  PersonContactDetailsCreateProps,
  PersonContactDetailsUpdateProps,
  PersonDetail,
  personDetailsLabels,
  TDetailLabel,
} from "@/api/usePerson";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
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
import { Button } from "../ui/button";
import { Edit, PlusCircle } from "lucide-react";
import { Input } from "../ui/input";
import ComboBox from "../combo-box/combo-box";

const FormSchema = z.object({
  label: z.string(),
  detail: z.string(),
});

const makeUrlValidation = (label: string) =>
  z.string().url(`Please enter a valid URL (for ${label})`);
const phoneValidation = z
  .string()
  .regex(/^\+?[\d\s-]{10,15}$/, "Please enter a valid phone number");
const emailValidation = z.string().email("Please enter a valid email address");

type TValidationSchemaMap = {
  [key in TDetailLabel]: typeof FormSchema;
};

const validationSchemaMap: TValidationSchemaMap = personDetailsLabels.reduce(
  (prev, { fieldLabel, ...rest }) => ({
    ...prev,
    [fieldLabel]: z.object({
      label: z.literal(fieldLabel),
      detail:
        rest.type === "url"
          ? makeUrlValidation(rest.formLabel)
          : rest.type === "email"
          ? emailValidation
          : phoneValidation,
    }),
  }),
  {} as TValidationSchemaMap
);

const getSchema = (label: TDetailLabel): typeof FormSchema =>
  validationSchemaMap[label] || FormSchema;

type CreateProps = {
  onCreate: (props: PersonContactDetailsCreateProps) => void;
  personDetail?: never;
  onChange?: never;
};

type UpdateProps = {
  onCreate?: never;
  personDetail: PersonDetail;
  onChange: (props: PersonContactDetailsUpdateProps) => void;
};

type PersonContactDetailsFormProps = (CreateProps | UpdateProps) & {
  personName: string;
};

const PersonContactDetailsForm: FC<PersonContactDetailsFormProps> = ({
  onChange,
  onCreate,
  personName,
  personDetail,
}) => {
  const [formOpen, setFormOpen] = useState(false);
  const [currentSchema, setCurrentSchema] = useState(
    !personDetail?.label ||
      !personDetailsLabels.some((l) => l.fieldLabel === personDetail.label)
      ? FormSchema
      : getSchema(personDetail.label as TDetailLabel)
  );
  const form = useForm({
    resolver: zodResolver(currentSchema),
    defaultValues: {
      label: personDetail?.label || "",
      detail: personDetail?.detail || "",
    },
  });

  const selectedLabel = useWatch({ control: form.control, name: "label" });

  useEffect(() => {
    form.reset(
      formOpen
        ? {
            label: personDetail?.label || "",
            detail: personDetail?.detail || "",
          }
        : { label: "", detail: "" }
    );
  }, [formOpen]);

  useEffect(() => {
    setCurrentSchema(
      personDetailsLabels.some((l) => l.fieldLabel === selectedLabel)
        ? getSchema(selectedLabel as TDetailLabel)
        : FormSchema
    );
    form.reset({ ...form.getValues() });
  }, [selectedLabel]);

  const handleCreate = (data: z.infer<typeof FormSchema>) =>
    onCreate && onCreate(data);

  const handleUpdate = (data: z.infer<typeof FormSchema>) =>
    onChange && onChange({ ...data, id: personDetail.id });

  const handleSubmit = (data: z.infer<typeof FormSchema>) => {
    if (!data.label) return;
    setFormOpen(false);
    (onCreate ? handleCreate : handleUpdate)(data);
  };

  return (
    <Form {...form}>
      <form>
        <Dialog open={formOpen} onOpenChange={setFormOpen}>
          <DialogTrigger asChild>
            {onCreate ? (
              <Button size="sm" className="gap-1">
                <PlusCircle className="w-4 h-4" />
                Contact detail
              </Button>
            ) : (
              <Edit className="w-5 h-5 text-muted-foreground hover:text-primary" />
            )}
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Contact detail</DialogTitle>
              <DialogDescription>
                {`${
                  onCreate ? "Create a new" : "Update a "
                } contact detail for ${personName}.`}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <FormField
                control={form.control}
                name="label"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type of contact</FormLabel>
                    <FormControl>
                      <ComboBox
                        options={personDetailsLabels.map(
                          ({ fieldLabel, formLabel }) => ({
                            value: fieldLabel,
                            label: formLabel,
                          })
                        )}
                        currentValue={field.value}
                        onChange={field.onChange}
                        placeholder="Select type…"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="detail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact detail</FormLabel>
                    <FormControl>
                      <Input placeholder="Provide detail…" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button onClick={form.handleSubmit(handleSubmit)}>
                {onCreate ? "Create" : "Save changes"}
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

export default PersonContactDetailsForm;
