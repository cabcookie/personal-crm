import useInbox, { debouncedOnChangeInboxNote, Inbox } from "@/api/useInbox";
import InboxDecisionMenu from "@/components/inbox/InboxDecisionMenu";
import ApiLoadingError from "@/components/layouts/ApiLoadingError";
import InboxEditor from "@/components/ui-elements/editors/inbox-editor/InboxEditor";
import { Skeleton } from "@/components/ui/skeleton";
import { Editor } from "@tiptap/core";
import { first, flow, identity } from "lodash/fp";
import { useEffect, useState } from "react";

const ProcessInboxItem = () => {
  const {
    inbox,
    error,
    isLoading,
    updateNote,
    setInboxItemDone,
    moveItemToProject,
    moveItemToPerson,
    moveItemToAccount,
  } = useInbox();
  const [firstItem, setFirstItem] = useState<Inbox | undefined>();

  useEffect(() => {
    flow(identity<Inbox[] | undefined>, first, setFirstItem)(inbox);
  }, [inbox]);

  const handleUpdate = (editor: Editor) => {
    if (!firstItem) return;
    debouncedOnChangeInboxNote(firstItem.id, editor, updateNote);
  };

  return (
    <>
      <ApiLoadingError error={error} title="Loading Inbox Items Failed" />

      {isLoading && <Skeleton className="w-full h-8" />}

      {firstItem && (
        <>
          <InboxDecisionMenu
            key={firstItem.id}
            setInboxItemDone={() => setInboxItemDone(firstItem.id)}
            addToProject={(projectId) =>
              moveItemToProject(firstItem, projectId)
            }
            addToPerson={(personId, withPrayer) =>
              moveItemToPerson(firstItem, personId, withPrayer)
            }
            addToAccount={(accountId) =>
              moveItemToAccount(firstItem, accountId)
            }
          />

          <div>
            <InboxEditor
              key={firstItem.id}
              notes={firstItem.note}
              saveNotes={handleUpdate}
              createdAt={firstItem.createdAt}
              updatedAt={firstItem.updatedAt}
            />
          </div>
        </>
      )}
    </>
  );
};

export default ProcessInboxItem;
