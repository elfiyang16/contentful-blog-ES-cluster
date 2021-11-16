import { DynamoDBStreamEvent } from "aws-lambda";
import { parseDynamoDbStream, partitionRecordsOnEventType } from "./dynamodb";
import { indexData, removeData } from "./elasticsearch";
import { createElasticSearchClient } from "./config";

export interface ContentfulBlogPost {
  id: string;
  title: string;
  slug: string;
  heroImage?: any;
  description?: string;
  body: string;
  publishDate: Date; // "2021-07-21 20:57:45"
  tags?: string[];
}

const client = createElasticSearchClient();
export const handler = async (event: DynamoDBStreamEvent) => {
  if (!event["Records"]) {
    throw new Error("No records found");
  }
  const parsedRecords = parseDynamoDbStream(event);
  const [recordsToIndex, recordsToDelete] =
    partitionRecordsOnEventType(parsedRecords);

  try {
    await indexData({ client, records: recordsToIndex });
  } catch (err) {
    throw err;
  }
  try {
    await removeData({ client, records: recordsToIndex });
  } catch (err) {
    throw err;
  }
};
