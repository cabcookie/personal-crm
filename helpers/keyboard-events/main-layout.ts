import { Context } from "@/contexts/ContextContext";
import { NextRouter } from "next/router";

export const addKeyDownListener = (
  router: NextRouter,
  setContext: (context: Context) => void
) => {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.ctrlKey && !event.metaKey && !event.altKey && !event.shiftKey) {
      const func = {
        t: () => router.push("/today"),
        m: () => router.push("/meetings"),
        c: () => router.push("/crm-projects"),
        p: () => router.push("/projects"),
        a: () => router.push("/accounts"),
        i: () => router.push("/inbox"),
        w: () => setContext("work"),
        h: () => setContext("hobby"),
        f: () => setContext("family"),
        k: () => console.log("Focus search bar"),
      }[event.key.toLowerCase()];
      if (func) {
        func();
      }
    }
  };
  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
};
