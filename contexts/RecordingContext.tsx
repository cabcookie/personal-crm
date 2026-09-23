import useSonicTranscription from "@/api/useSonicTranscription";
import { createContext, FC, ReactNode, useContext } from "react";

/**
 * Global recording context. Holds the ONE Sonic transcription engine so a
 * live meeting recording survives page navigation: the meeting page binds its
 * meeting into the engine and drives start/stop, while the app header reads the
 * same state to show a recording indicator + detected-people marker anywhere in
 * the app. Mounted once in `pages/_app.tsx`, above the per-page components that
 * unmount on navigation.
 */
type RecordingContextType = ReturnType<typeof useSonicTranscription>;

const RecordingContext = createContext<RecordingContextType | undefined>(
  undefined
);

export const RecordingProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const sonic = useSonicTranscription();
  return (
    <RecordingContext.Provider value={sonic}>
      {children}
    </RecordingContext.Provider>
  );
};

export const useRecording = () => {
  const ctx = useContext(RecordingContext);
  if (ctx === undefined) {
    throw new Error("useRecording must be used within a RecordingProvider");
  }
  return ctx;
};
