import { FC, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import usePeople from "@/api/usePeople";
import { useAccountsContext } from "@/api/ContextAccounts";
import { client } from "@/lib/amplify";
import PeopleSelector from "../ui-elements/selectors/people-selector";
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
  /** Pre-fill the search field (e.g. the heard name). */
  initialName?: string;
  /** Called after a person was found or created and (optionally) linked to a company. */
  onCreated: (person: CreatedPerson) => void;
};

/**
 * Resolves a detected mention that had no confident match: search for the
 * right person (reusing the same people-search used elsewhere in the app)
 * and, if nothing fits, create a new one. If the chosen person already has a
 * company, it's just shown; only a person without one (typically one just
 * created here) gets the company picker. The company field is a search
 * against existing accounts too — never free text — so this never creates a
 * duplicate "ALDI" vs. "Aldi" account. No start date is set on the resulting
 * PersonAccount link: we don't actually know when the person joined that
 * company, so the field is left empty rather than defaulting to today.
 */
const CreateDetectedPersonDialog: FC<Props> = ({
  open,
  onOpenChange,
  initialName,
  onCreated,
}) => {
  const { getPersonById } = usePeople();
  const { accounts } = useAccountsContext();
  const [personId, setPersonId] = useState("");
  const [accountId, setAccountId] = useState("");
  const [saving, setSaving] = useState(false);

  // Reset the fields when the dialog is (re)opened for a new detection.
  const [lastOpen, setLastOpen] = useState(open);
  if (open !== lastOpen) {
    setLastOpen(open);
    if (open) {
      setPersonId("");
      setAccountId("");
    }
  }

  // Resolve from the people cache (covers recent people, search hits and
  // freshly created people — not just the recent set).
  const person = personId ? getPersonById(personId) : undefined;
  // An existing person usually already belongs to a company; only offer the
  // company picker when the chosen person has none (typically a person just
  // created here), so it can be linked right away.
  const existingCompany = person?.accountNames || null;
  const needsCompany = !!personId && !existingCompany;

  const handleConfirm = async () => {
    if (!personId) return;
    setSaving(true);
    try {
      const account = accounts?.find((a) => a.id === accountId);
      const personName = person?.name ?? initialName ?? "";

      if (needsCompany && accountId) {
        const { errors } = await client.models.PersonAccount.create({
          personId,
          accountId,
          // No startDate: we don't know when this employment actually began,
          // so the field is left unset rather than defaulting to today.
        });
        if (errors)
          console.error("create PersonAccount (detected person)", errors);
      }

      onCreated({
        personId,
        name: personName,
        company: existingCompany ?? account?.name ?? null,
        role: null,
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
          <DialogTitle>Assign person</DialogTitle>
        </DialogHeader>
        <div className="min-w-0 space-y-3">
          <div className="min-w-0 space-y-1">
            <Label htmlFor="detected-person-search">Person</Label>
            <PeopleSelector
              value={personId}
              onChange={(id) => {
                setPersonId(id ?? "");
                setAccountId("");
              }}
              allowNewPerson
              placeholder={
                initialName ? `Search: “${initialName}”…` : "Search person…"
              }
            />
          </div>
          {existingCompany && (
            <p className="text-sm text-muted-foreground">
              Company: {existingCompany}
            </p>
          )}
          {needsCompany && (
            <div className="min-w-0 space-y-1">
              <Label htmlFor="detected-person-account">
                Company (optional)
              </Label>
              <AccountSelector
                value={accountId}
                onChange={(id) => setAccountId(id ?? "")}
                allowCreateAccounts
                placeholder="Search company…"
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={saving || !personId}>
            {saving && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}
            Assign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDetectedPersonDialog;
