import { Account, useAccountsContext } from "@/api/ContextAccounts";
import { Editor } from "@tiptap/core";
import { FC } from "react";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import { debouncedUpdateAccountDetails } from "../ui-elements/account-details/account-updates-helpers";
import NotesWriter from "../ui-elements/notes-writer/NotesWriter";

type AccountIntroductionProps = {
  account: Account;
  showIntroduction?: boolean;
};

const AccountIntroduction: FC<AccountIntroductionProps> = ({
  account,
  showIntroduction,
}) => {
  const { updateAccount } = useAccountsContext();

  const handleUpdateIntroduction = (editor: Editor) => {
    debouncedUpdateAccountDetails({
      id: account.id,
      editor,
      updateAccountFn: updateAccount,
    });
  };

  return (
    <DefaultAccordionItem
      value="introduction"
      triggerTitle="Introduction"
      isVisible={!!showIntroduction}
    >
      <NotesWriter
        notes={account.introduction}
        placeholder="Describe the account..."
        saveNotes={handleUpdateIntroduction}
      />
    </DefaultAccordionItem>
  );
};

export default AccountIntroduction;
