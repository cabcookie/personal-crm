import { DynamoDBRecord } from "aws-lambda";

export class SkipRecordError extends Error {
  private skipping: boolean;

  constructor(msg: string) {
    super(msg);
    this.skipping = true;
  }
  isSkipping() {
    return this.skipping;
  }
}

export const loadTaskRecord = (record: DynamoDBRecord): ExportTask => {
  // Only process INSERT events with status="CREATED"
  if (record.eventName !== "INSERT")
    throw new SkipRecordError(`Skipping ${record.eventName} event`);

  const newImage = record.dynamodb?.NewImage;
  if (!newImage) throw new SkipRecordError("No NewImage found in record");

  const status = newImage.status?.S;
  if (status !== "CREATED")
    throw new SkipRecordError(`Skipping record with status: ${status}`);

  // Extract task details from DynamoDB record
  const taskId = newImage.id?.S;
  const dataSource = newImage.dataSource?.S;
  const itemId = newImage.itemId?.S;
  const itemName = newImage.itemName?.S;
  const startDateStr = newImage.startDate?.S;
  const endDateStr = newImage.endDate?.S;

  if (!taskId || !dataSource || !itemId || !startDateStr || !endDateStr)
    throw new SkipRecordError(
      `Missing required fields in record: ${JSON.stringify({
        taskId,
        dataSource,
        itemId,
        startDateStr,
        endDateStr,
      })}`
    );

  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  return { id: taskId, dataSource, itemId, itemName, startDate, endDate };
};

export type ExportTask = {
  id: string;
  dataSource: string;
  itemId: string;
  itemName?: string;
  startDate: Date;
  endDate: Date;
};
