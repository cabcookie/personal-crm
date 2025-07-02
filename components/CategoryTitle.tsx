import { useRouter } from "next/router";
import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import { IoChevronBackOutline } from "react-icons/io5";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { Badge } from "./ui/badge";

export enum BadgeType {
  DRAFT = "draft",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  PENDING = "pending",
  ERROR = "error",
}

export type CategoryTitleProps = {
  title?: string;
  addButton?: {
    label: string;
    onClick: () => void;
  };
  drawBackBtn?: boolean;
  onBackBtnClick?: () => void;
  saveTitle?: (newTitle: string) => void;
  onTitleChange?: (newTitle: string) => void;
  badge?: BadgeType;
};

const CategoryTitle: FC<CategoryTitleProps> = (props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(props.title);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

  const getBadgeProps = (badgeType: BadgeType) => {
    switch (badgeType) {
      case BadgeType.DRAFT:
        return { variant: "outline" as const, children: "Draft" };
      case BadgeType.IN_PROGRESS:
        return { variant: "outline" as const, children: "In Progress" };
      case BadgeType.COMPLETED:
        return { variant: "secondary" as const, children: "Completed" };
      case BadgeType.PENDING:
        return { variant: "outline" as const, children: "Pending" };
      case BadgeType.ERROR:
        return { variant: "destructive" as const, children: "Error" };
      default:
        return { variant: "outline" as const, children: badgeType };
    }
  };

  const handleTitleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (props.onTitleChange) props.onTitleChange(event.target.value);
    setTitle(event.target.value);
  };

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }, [title, isEditing]);

  useEffect(() => {
    setTitle(props.title);
  }, [props.title]);

  const handleBlur = () => {
    setIsEditing(false);
    if (props.saveTitle && title) {
      props.saveTitle(title);
    }
  };

  return (
    <header className="sticky top-12 z-40 bg-bgTransparent pt-3 md:pt-8 pb-4">
      <div className="flex justify-between gap-2">
        {(props.drawBackBtn || props.onBackBtnClick) && (
          <div>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-lg md:text-xl text-[--context-color]"
              onClick={
                props.onBackBtnClick
                  ? props.onBackBtnClick
                  : () => router.back()
              }
            >
              <IoChevronBackOutline />
            </Button>
          </div>
        )}
        {!title ? (
          <Skeleton className="text-left md:text-center flex-1 h-6 md:h-8 p-0 mt-1 mb-2 md:mt-0" />
        ) : (
          <div className="text-left md:text-center flex-1 text-2xl md:text-3xl font-bold leading-8 p-0 mt-0 tracking-tight">
            {props.saveTitle && isEditing ? (
              <textarea
                rows={1}
                ref={textAreaRef}
                value={title}
                onChange={handleTitleChange}
                onBlur={handleBlur}
                autoFocus
                className="border-none outline-none w-full overflow-hidden resize-none textarea-bottom-line"
              />
            ) : (
              <div className="flex gap-2 justify-center">
                <div
                  className={
                    props.saveTitle && "cursor-pointer hover:border-b-2 mb-1"
                  }
                  onClick={() => (props.saveTitle ? setIsEditing(true) : null)}
                >
                  {title}
                </div>
                <div className="leading-6">
                  {props.badge && <Badge {...getBadgeProps(props.badge)} />}
                </div>
              </div>
            )}
          </div>
        )}
        {props.addButton && (
          <Button size="sm" onClick={props.addButton.onClick}>
            {props.addButton.label}
          </Button>
        )}
      </div>
    </header>
  );
};

export default CategoryTitle;
