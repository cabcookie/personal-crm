import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { getUrl } from "aws-amplify/storage";
import Image from "next/image";
import { FC, useEffect, useState } from "react";

type S3ImageProps = {
  imgKey?: string;
  tempUrl?: string;
  width?: number;
  height?: number;
  alt: string;
  hasNoImage?: boolean;
  noImagePlaceholder?: string;
};

const S3Image: FC<S3ImageProps> = ({
  tempUrl,
  imgKey,
  alt,
  hasNoImage,
  noImagePlaceholder = "No image provided.",
  width = 200,
  height = 200,
}) => {
  const [imageUrl, setImgUrl] = useState<string | undefined>(tempUrl);

  useEffect(() => {
    if (!tempUrl) return;
    setImgUrl(tempUrl);
  }, [tempUrl]);

  const setCurrentImgUrl = async (
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

  useEffect(() => {
    setCurrentImgUrl(imgKey, setImgUrl);
  }, [imgKey]);

  return hasNoImage ? (
    <div
      className={cn(
        `w-[${width}px] h-[${height}px]`,
        "rounded-md border border-solid flex items-center justify-center text-muted-foreground text-sm font-semibold"
      )}
    >
      {noImagePlaceholder}
    </div>
  ) : !imageUrl ? (
    <Skeleton className={cn(`w-[${width}px] h-[${height}px]`, "rounded-xl")} />
  ) : (
    <Image
      src={imageUrl}
      alt={alt}
      width={width}
      height={height}
      className={cn(tempUrl && "animate-pulseOpacity")}
    />
  );
};

export default S3Image;
