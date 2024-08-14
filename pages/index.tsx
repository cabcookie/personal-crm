import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const lastVisitedPage = window.localStorage.getItem("lastVisitedPage");

    if (lastVisitedPage) {
      router.replace(lastVisitedPage);
    } else {
      router.replace("/projects");
    }
  }, [router]);

  return null;
}
