import { DynamoDBStreamEvent, DynamoDBRecord } from "aws-lambda";
import { DynamoDB } from "aws-sdk";

export const parseDynamoDbStream = (event: DynamoDBStreamEvent) => {
  return event.Records.filter((record) => record.dynamodb).map((record) =>
    getParsedRecord(record)
  );
};

const getParsedRecord = (record: DynamoDBRecord) => {
  const tableName =
    record.eventSourceARN && record.eventSourceARN.split("/")[1];
  if (!tableName) {
    throw new Error("Table name not found.");
  }
  const parsedRecord = DynamoDB.Converter.unmarshall({
    newImage: { M: (record.dynamodb && record.dynamodb.NewImage) || {} },
    oldImage: { M: (record.dynamodb && record.dynamodb.OldImage) || {} },
    keys: { M: record.dynamodb && record.dynamodb.Keys },
    eventName: { S: record.eventName },
    index: {
      S: tableName.toLowerCase(),
    },
  });

  return parsedRecord;
};

export const partitionRecordsOnEventType = (
  parsedRecords: Array<ReturnType<typeof getParsedRecord>>
) => {
  return parsedRecords
    .map((record) => ({
      record,
      isDelete: record.eventName === "REMOVE",
    }))
    .reduce(
      (
        buckets: [
          Array<ReturnType<typeof getParsedRecord>>,
          Array<ReturnType<typeof getParsedRecord>>
        ],
        { record, isDelete }
      ) => {
        buckets[isDelete ? 1 : 0].push(record);
        return buckets;
      },
      [[], []]
    );
};
