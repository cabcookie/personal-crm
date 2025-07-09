import { ProjectForReview } from "@/helpers/weeklyReviewHelpers";
import {
  Dispatch,
  FC,
  SetStateAction,
  useState,
  useRef,
  useEffect,
} from "react";

interface CopyResultBaseProps {
  setProjectNotes: Dispatch<SetStateAction<ProjectForReview[]>>;
  label: string;
  placeholder: string;
  inputId: string;
  onProcessJson: (
    jsonData: any[],
    setProjectNotes: Dispatch<SetStateAction<ProjectForReview[]>>
  ) => void;
}

export const CopyResultBase: FC<CopyResultBaseProps> = ({
  setProjectNotes,
  label,
  placeholder,
  inputId,
  onProcessJson,
}) => {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [value]);

  const extractJSONFromText = (text: string): any[] | null => {
    try {
      // Find the start of the JSON array
      const startIndex = text.indexOf("[");
      if (startIndex === -1) return null;

      // Count brackets to find the matching closing bracket
      let bracketCount = 0;
      let endIndex = -1;

      for (let i = startIndex; i < text.length; i++) {
        if (text[i] === "[") {
          bracketCount++;
        } else if (text[i] === "]") {
          bracketCount--;
          if (bracketCount === 0) {
            endIndex = i;
            break;
          }
        }
      }

      if (endIndex === -1) return null;

      const jsonString = text.substring(startIndex, endIndex + 1);
      return JSON.parse(jsonString);
    } catch (error) {
      console.error("Failed to parse JSON from text:", error);
      return null;
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pastedText = e.clipboardData.getData("text");
    const jsonData = extractJSONFromText(pastedText);

    if (jsonData && Array.isArray(jsonData)) {
      onProcessJson(jsonData, setProjectNotes);
    }
  };

  return (
    <div className="space-y-2">
      <label htmlFor={inputId} className="block text-sm font-medium">
        {label}
      </label>
      <textarea
        id={inputId}
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onPaste={handlePaste}
        placeholder={placeholder}
        className="w-full p-3 border border-gray-300 rounded-md resize-none overflow-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        rows={2}
      />
    </div>
  );
};
