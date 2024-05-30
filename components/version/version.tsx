import { useEffect, useState } from "react";

const fetchVersion = async (setVersion: (version: string) => void) => {
  try {
    const response = await fetch("/api/version");
    const data = await response.json();
    setVersion(data.version);
  } catch (error) {
    console.error("Error fetching version", error);
  }
};

const Version = () => {
  const [version, setVersion] = useState<string | undefined>(undefined);

  useEffect(() => {
    fetchVersion(setVersion);
  }, []);

  return version && `App version: ${version}`;
};

export default Version;
