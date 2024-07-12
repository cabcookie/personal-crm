import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { StorageImage } from "@aws-amplify/ui-react-storage";
// import "@aws-amplify/ui-react/styles.css";
import Image from "next/image";
import { FC } from "react";

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
}) =>
  hasNoImage ? (
    <div
      className={cn(
        `w-[${width}px] h-[${height}px]`,
        "rounded-md border border-solid flex items-center justify-center text-muted-foreground text-sm font-semibold"
      )}
    >
      {noImagePlaceholder}
    </div>
  ) : !tempUrl ? (
    !imgKey ? (
      <Skeleton
        className={cn(`w-[${width}px] h-[${height}px]`, "rounded-xl")}
      />
    ) : (
      <StorageImage path={imgKey} width={width} height={height} alt={alt} />
    )
  ) : (
    <Image
      src={tempUrl}
      alt={alt}
      width={width}
      height={height}
      className={cn(tempUrl && "animate-pulseOpacity")}
    />
  );

export default S3Image;
