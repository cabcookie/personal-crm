import { FC, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import usePeople from "@/api/usePeople";
import { useAccountsContext } from "@/api/ContextAccounts";
import { client } from "@/lib/amplify";
import AccountSelector from "../ui-elements/selectors/account-selector";

export type CreatedPerson = {
  personId: string;
  name: string;
  company: string | null;
  role: string | null;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /**
   * The person already created with `initialName` when "Create …" was chosen
   * in the search. Null if there was no name to create them with yet (then
   * they're created on confirm).
   */
  personId: string | null;
  /** The name typed into the search (editable here). */
  initialName?: string;
  /** Called once the person is named and (optionally) linked to a company. */
  onCreated: (person: CreatedPerson) => void;
};

/**
 * Completes a person that was just created from the mention search: the name
 * (pre-filled with what was typed, editable to fix capitalisation; a change
 * renames the already-created person), plus an optional company and position,
 * stored as one PersonAccount link. The company is a search against existing
 * accounts — never free text — so this never creates a duplicate "ALDI" vs.
 * "Aldi" account. No start date is set on the link: we don't know when the
 * person joined, so it's left empty rather than defaulting to today.
 */
const CreateDetectedPersonDialog: FC<Props> = ({
  open,
  onOpenChange,
  personId,
  initialName = "",
  onCreated,
}) => {
  const { createPerson, renamePerson } = usePeople();
  const { accounts } = useAccountsContext();
  const [name, setName] = useState(initialName);
  const [accountId, setAccountId] = useState("");
  const [position, setPosition] = useState("");
  const [saving, setSaving] = useState(false);

  // Reset the fields when the dialog is (re)opened for a new person.
  const [lastOpen, setLastOpen] = useState(open);
  if (open !== lastOpen) {
    setLastOpen(open);
    if (open) {
      setName(initialName);
      setAccountId("");
      setPosition("");
    }
  }

  const trimmedName = name.trim();

  const handleConfirm = async () => {
    if (!trimmedName) return;
    setSaving(true);
    try {
      let id = personId;
      if (!id) {
        id = (await createPerson(trimmedName)) ?? null;
      } else if (trimmedName !== initialName.trim()) {
        await renamePerson(id, trimmedName);
      }
      if (!id) return;

      const account = accounts?.find((a) => a.id === accountId);
      const role = position.trim() || null;
      if (accountId) {
        const { errors } = await client.models.PersonAccount.create({
          personId: id,
          accountId,
          position: role,
          // No startDate: we don't know when this employment actually began.
        });
        if (errors)
          console.error("create PersonAccount (detected person)", errors);
      }

      onCreated({
        personId: id,
        name: trimmedName,
        company: account?.name ?? null,
        role,
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
          <DialogTitle>New person</DialogTitle>
        </DialogHeader>
        <form
          className="min-w-0 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            void handleConfirm();
          }}
        >
          <div className="space-y-1">
            <Label htmlFor="new-person-name">Name</Label>
            <Input
              id="new-person-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>
          <div className="min-w-0 space-y-1">
            <Label>Company (optional)</Label>
            <AccountSelector
              value={accountId}
              onChange={(id) => setAccountId(id ?? "")}
              allowCreateAccounts
              placeholder="Search company…"
            />
          </div>
          {accountId && (
            <div className="space-y-1">
              <Label htmlFor="new-person-position">Position (optional)</Label>
              <Input
                id="new-person-position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="e.g. CEO eCommerce"
              />
            </div>
          )}
          {/* Hidden submit so Enter in a text field confirms. */}
          <button type="submit" hidden />
        </form>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={saving || !trimmedName}>
            {saving && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}
            Assign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDetectedPersonDialog;
