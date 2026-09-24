import { FC, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import usePeople from "@/api/usePeople";
import { useAccountsContext } from "@/api/ContextAccounts";
import { client } from "@/lib/amplify";
import { newDateString } from "@/helpers/functional";
import { toast } from "../ui/use-toast";

export type CreatedPerson = {
  personId: string;
  name: string;
  company: string | null;
  role: string | null;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Pre-fill the name field (e.g. the heard name). */
  initialName?: string;
  /** Called after the person (+ optional employment) was created. */
  onCreated: (person: CreatedPerson) => void;
};

/**
 * Small dialog to create a NEW person from a detected mention that had no
 * match. Lets the user edit the name and set current company + role. Creates
 * the Person, resolves/creates the company Account, and links them via a
 * PersonAccount (current employment). The created person is handed back so the
 * caller can assign + confirm the detection in one step.
 */
const CreateDetectedPersonDialog: FC<Props> = ({
  open,
  onOpenChange,
  initialName,
  onCreated,
}) => {
  const { createPerson } = usePeople();
  const { accounts, createAccount } = useAccountsContext();
  const [name, setName] = useState(initialName ?? "");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [saving, setSaving] = useState(false);

  // Keep the name field in sync when the dialog is (re)opened for a new name.
  const [lastInitial, setLastInitial] = useState(initialName);
  if (initialName !== lastInitial) {
    setLastInitial(initialName);
    setName(initialName ?? "");
    setCompany("");
    setRole("");
  }

  const resolveAccountId = async (
    companyName: string
  ): Promise<string | null> => {
    const trimmed = companyName.trim();
    if (!trimmed) return null;
    const existing = accounts?.find(
      (a) => a.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (existing) return existing.id;
    const created = await createAccount(trimmed);
    return created?.id ?? null;
  };

  const handleCreate = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) return;
    setSaving(true);
    try {
      const personId = await createPerson(trimmedName);
      if (!personId) {
        toast({ title: "Person konnte nicht angelegt werden" });
        return;
      }

      const companyName = company.trim();
      const roleName = role.trim();
      if (companyName) {
        const accountId = await resolveAccountId(companyName);
        if (accountId) {
          const { errors } = await client.models.PersonAccount.create({
            personId,
            accountId,
            position: roleName || undefined,
            startDate: newDateString(),
          });
          if (errors)
            console.error("create PersonAccount (detected person)", errors);
        }
      }

      onCreated({
        personId,
        name: trimmedName,
        company: companyName || null,
        role: roleName || null,
      });
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Neue Person anlegen</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="detected-person-name">Name</Label>
            <Input
              id="detected-person-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Vor- und Nachname"
              autoFocus
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="detected-person-company">Unternehmen</Label>
            <Input
              id="detected-person-company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="z. B. ALDI (optional)"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="detected-person-role">Position</Label>
            <Input
              id="detected-person-role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="z. B. Managing Director (optional)"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={saving}
          >
            Abbrechen
          </Button>
          <Button onClick={handleCreate} disabled={saving || !name.trim()}>
            {saving && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}
            Anlegen &amp; zuordnen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDetectedPersonDialog;
