import { FC } from "react";

interface ErrorsProps {
  hasError?: boolean;
  errors?: { message?: string }[];
}

const Errors: FC<ErrorsProps> = ({ hasError, errors }) =>
  hasError &&
  errors?.map((error, index) => (
    <div key={index} className="text-sm p-2 text-red-600 font-semibold">
      {error.message}
    </div>
  ));

export default Errors;
