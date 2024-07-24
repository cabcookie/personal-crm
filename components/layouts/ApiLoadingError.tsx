import { FileWarning } from "lucide-react";
import { FC } from "react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

type ApiLoadingErrorProps = {
  error?: { message: string };
  title: string;
};

const ApiLoadingError: FC<ApiLoadingErrorProps> = ({ error, title }) =>
  error && (
    <Alert variant="destructive">
      <FileWarning className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{error.message}</AlertDescription>
    </Alert>
  );

export default ApiLoadingError;
