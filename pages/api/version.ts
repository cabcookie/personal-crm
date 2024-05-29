import { readFileSync } from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import { join } from "path";

type Data = { version: string };

const handler = (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const packageJsonPath = join(process.cwd(), "package.json");
  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
  res.status(200).json({ version: packageJson.version });
};

export default handler;
