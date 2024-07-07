import { Context } from "@/contexts/ContextContext";
import { NextRouter } from "next/router";

export const addKeyDownListener = (
  router: NextRouter,
  setContext: (context: Context) => void,
  toggleNavMenu: () => void,
  openCreateInboxItemDialog: () => void
) => {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.ctrlKey && !event.metaKey && !event.altKey && !event.shiftKey) {
      const func = {
        t: () => router.replace("/today"),
        m: () => router.replace("/meetings"),
        c: () => router.replace("/crm-projects"),
        p: () => router.replace("/projects"),
        a: () => router.replace("/accounts"),
        i: () => router.replace("/inbox"),
        w: () => setContext("work"),
        h: () => setContext("hobby"),
        f: () => setContext("family"),
        "+": openCreateInboxItemDialog,
      }[event.key.toLowerCase()];
      if (func) {
        func();
      }
    }
    if (event.metaKey && !event.ctrlKey && !event.altKey && !event.shiftKey) {
      const func = {
        k: toggleNavMenu,
        p: () => {
          event.preventDefault();
          toggleNavMenu();
        },
      }[event.key.toLowerCase()];
      if (func) {
        func();
      }
    }
  };
  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
};
