import { GraphQLFormattedError } from "@/api/globals";
import { EditorJsonContent } from "../notes-editor/useExtensions";

interface TTransactionError extends Error {
  block: EditorJsonContent | string | null;
  failedTransaction: string;
  graphQlErrors?: GraphQLFormattedError[];
}

class TransactionError extends Error implements TTransactionError {
  block: EditorJsonContent | string | null;
  failedTransaction: string;
  graphQlErrors?: GraphQLFormattedError[] | undefined;

  constructor(
    message: string,
    block: EditorJsonContent | string | null,
    failedTransaction: string,
    graphQlErrors?: GraphQLFormattedError[]
  ) {
    super(message, { cause: { block, failedTransaction, graphQlErrors } });
    this.name = "TransactionError";
    this.block = block;
    this.failedTransaction = failedTransaction;
    this.graphQlErrors = graphQlErrors;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TransactionError);
    }
  }
}

export default TransactionError;
