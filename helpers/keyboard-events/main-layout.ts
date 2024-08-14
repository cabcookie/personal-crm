import { Context } from "@/contexts/ContextContext";
import { NextRouter } from "next/router";

export const addKeyDownListener = (
  router: NextRouter,
  setContext: (context: Context) => void,
  toggleNavMenu: () => void,
  openCreateInboxItemDialog: () => void
) => {
  const routeToUrl = (url: string) => (isMetaKeyPressed: boolean) => {
    if (isMetaKeyPressed) window.open(url, "_blank");
    else router.push(url);
  };

  const switchContext = (context: Context) => (isMetaKeyPressed: boolean) =>
    !isMetaKeyPressed && setContext(context);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.ctrlKey && !event.altKey && !event.shiftKey) {
      const func: ((isMetaKeyPressed: boolean) => void) | undefined = {
        // t: routeToUrl("/today"),
        k: routeToUrl("/planweek"),
        // d: routeToUrl("/planday"),
        m: routeToUrl("/meetings"),
        c: routeToUrl("/crm-projects"),
        p: routeToUrl("/projects"),
        a: routeToUrl("/accounts"),
        i: routeToUrl("/inbox"),
        w: switchContext("work"),
        h: switchContext("hobby"),
        f: switchContext("family"),
        "+": openCreateInboxItemDialog,
      }[event.key.toLowerCase()];
      if (func) {
        func(event.metaKey);
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
