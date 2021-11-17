import AWS from "aws-sdk";
import { Client } from "@elastic/elasticsearch";
const createAwsElasticsearchConnector = require("aws-elasticsearch-connector");

const REGION = process.env.AWS_ACCESS_KEY_ID;
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
  throw new Error(`Error getting AWS credentials`);
}

AWS.config.update({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  region: REGION,
});

export const createElasticSearchClient = () => {
  const client = new Client({
    ...createAwsElasticsearchConnector(AWS.config),
    node: process.env.ES_HOST ?? `http://localhost:9200`,
    maxRetries: 5,
    requestTimeout: 30000,
  });

  return client;
};
