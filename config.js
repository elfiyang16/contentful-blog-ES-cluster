const contentfulExport = require("contentful-export");
const contentful = require("contentful");
const AWS = require("aws-sdk");
const { Client } = require("@elastic/elasticsearch");
const createAwsElasticsearchConnector = require("aws-elasticsearch-connector");
const region = "eu-west-1";
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

const mgtToken = process.env.CONTENTFUL_MGT_ACCESS_TOKEN;
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;
const spaceId = process.env.CONTENTFUL_SPACE_ID;
const contentfulEnv = process.env.CONTENTFUL_ENVIRONMENT;
const ELASTICSEARCH_INDEX_NAME = contentfulEnv;

if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
  throw new Error(`Error getting AWS credentials: ${error}`);
}

AWS.config.update({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  region: region,
});

const createContentfulClient = () => {
  const client = contentful.createClient({
    space: spaceId,
    accessToken: accessToken,
  });
  return client;
};

const createElasticSearchClient = (endpoint) => {
  const client = new Client({
    ...createAwsElasticsearchConnector(AWS.config),
    node: process.env.ES_ENDPOINT,
  });
  client.on("response", (error) => {
    if (error == null) return;
    console.error(inspect(error, { depth: 4 }));
  });
  return client;
};
