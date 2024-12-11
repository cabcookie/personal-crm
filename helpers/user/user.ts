import { getUrl } from "aws-amplify/storage";

export const setCurrentImgUrl = async (
  key: string | undefined,
  setUrl: (url: string | undefined) => void
) => {
  if (!key) {
    setUrl(undefined);
    return;
  }
  const { url } = await getUrl({ path: key });
  setUrl(url.toString());
};
