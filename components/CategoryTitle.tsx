import { useRouter } from "next/router";
import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import { IoChevronBackOutline } from "react-icons/io5";
import { Button } from "./ui/button";

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
};

const CategoryTitle: FC<CategoryTitleProps> = (props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(props.title);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

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
    <header className="sticky top-12 z-20 bg-bgTransparent pt-3 md:pt-8 pb-4">
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
        {title && (
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
              <h1
                className={
                  props.saveTitle && "cursor-pointer hover:border-b-2 mb-1"
                }
                onClick={() => (props.saveTitle ? setIsEditing(true) : null)}
              >
                {title}
              </h1>
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
