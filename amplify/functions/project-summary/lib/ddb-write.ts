import {
  DynamoDBClient,
  UpdateItemCommand,
  type AttributeValue,
} from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

/**
 * Direct-to-DynamoDB writes for the summary/snapshot/image-description
 * Lambdas.
 *
 * These functions read data directly from DynamoDB (reusing the export
 * renderer's owner-filtered readers) and write results back the same way,
 * deliberately bypassing AppSync. Writing through AppSync in IAM mode strips
 * the `::username` suffix off the `owner` attribute, which would corrupt the
 * `sub::username` owner format every other read relies on. A raw UpdateItem
 * touches only the attributes we name and leaves `owner` untouched.
 *
 * Table names come from `DDB_TABLE_<MODEL>` env vars, injected by the custom
 * CDK wiring (same convention as the export reader).
 */

const client = new DynamoDBClient({});

const getTableName = (model: string): string => {
  const envKey = `DDB_TABLE_${model.toUpperCase()}`;
  const name = process.env[envKey];
  if (!name) {
    throw new Error(
      `Missing env ${envKey}. Add ${model} to the summary Lambda's table wiring in custom/backend/project-summary.ts.`
    );
  }
  return name;
};

/**
 * Set the given attributes on one item by primary key (`id`). Only the named
 * attributes are written; everything else on the item (including `owner`) is
 * left as-is. `expectedOwner`, when provided, guards the write with a
 * condition so a record whose owner does not match is never mutated — a
 * defence-in-depth tenant check mirroring the read-side owner filter.
 */
export const updateItemAttributes = async (
  model: string,
  id: string,
  attributes: Record<string, unknown>,
  expectedOwner?: string
): Promise<void> => {
  const entries = Object.entries(attributes);
  if (!entries.length) return;

  const TableName = getTableName(model);
  const names: Record<string, string> = {};
  const values: Record<string, AttributeValue> = {};
  const sets: string[] = [];
  const removes: string[] = [];

  entries.forEach(([key, value], i) => {
    const nameKey = `#a${i}`;
    names[nameKey] = key;
    if (value === undefined) {
      // `undefined` means REMOVE the attribute. Setting it to a DynamoDB NULL
      // instead is wrong — and fatal when the attribute is a (sparse) GSI key,
      // which rejects NULL. REMOVE both deletes the value and drops the item
      // from any sparse index keyed on it.
      removes.push(nameKey);
      return;
    }
    const valueKey = `:v${i}`;
    values[valueKey] = marshall(
      { v: value },
      {
        removeUndefinedValues: true,
      }
    ).v;
    sets.push(`${nameKey} = ${valueKey}`);
  });

  const clauses: string[] = [];
  if (sets.length) clauses.push(`SET ${sets.join(", ")}`);
  if (removes.length) clauses.push(`REMOVE ${removes.join(", ")}`);

  if (expectedOwner) {
    names["#owner"] = "owner";
    values[":expectedOwner"] = { S: expectedOwner };
  }

  const command: ConstructorParameters<typeof UpdateItemCommand>[0] = {
    TableName,
    Key: { id: { S: id } },
    UpdateExpression: clauses.join(" "),
    ExpressionAttributeNames: names,
    ...(Object.keys(values).length
      ? { ExpressionAttributeValues: values }
      : {}),
    ...(expectedOwner
      ? { ConditionExpression: "#owner = :expectedOwner" }
      : {}),
  };

  await client.send(new UpdateItemCommand(command));
};
