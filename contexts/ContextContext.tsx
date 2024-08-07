import {
  FC,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export type Context = "family" | "hobby" | "work";
export type SetContextStateFn = (context: Context) => void;

interface ContextContextType {
  context?: Context;
  setContext: SetContextStateFn;
  isWorkContext: () => boolean;
  isHobbyContext: () => boolean;
  isFamilyContext: () => boolean;
}

type ContextHookResult = {
  getContext: (setContext: SetContextStateFn, fallBackContext: Context) => void;
  saveContext: SetContextStateFn;
};

interface ContextContextProviderProps {
  children: ReactNode;
  useContextHook: () => ContextHookResult;
}

const ContextContext = createContext<ContextContextType | undefined>(undefined);

export const ContextContextProvider: FC<ContextContextProviderProps> = ({
  children,
  useContextHook,
}) => {
  const [context, setContext] = useState<Context>();
  const { getContext, saveContext } = useContextHook();

  useEffect(() => {
    getContext(setContext, context || "work");
  }, [getContext, context]);

  useEffect(() => {
    if (!context) return;
    document.documentElement.style.setProperty(
      "--context-color",
      `rgb(var(--context-color-${context}))`
    );
    document.documentElement.style.setProperty(
      "--context-color-bg",
      `rgba(var(--context-color-${context}), 0.05)`
    );
    document.documentElement.style.setProperty(
      "--context-color-hover",
      `hsl(var(--context-color-${context}-hover))`
    );
    document.documentElement.style.setProperty(
      "--context-color-secondary",
      `hsl(var(--context-color-${context}-secondary))`
    );
    document.documentElement.style.setProperty(
      "--context-color-hover-secondary",
      `hsl(var(--context-color-${context}-hover-secondary))`
    );
    document.documentElement.style.setProperty(
      "--logo-filter",
      `var(--logo-filter-${context})`
    );
  }, [context]);

  const handleContextChange = (context: Context) => {
    saveContext(context);
    setContext(context);
  };

  return (
    <ContextContext.Provider
      value={{
        context,
        setContext: handleContextChange,
        isFamilyContext: () => context === "family",
        isWorkContext: () => context === "work",
        isHobbyContext: () => context === "hobby",
      }}
    >
      {children}
    </ContextContext.Provider>
  );
};

export const useContextContext = () => {
  const context = useContext(ContextContext);
  if (context === undefined) {
    throw new Error(
      "useContextContext must be used within an ContextContextProvider"
    );
  }
  return context;
};
