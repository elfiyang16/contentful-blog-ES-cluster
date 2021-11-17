import { Client } from "@elastic/elasticsearch";

// INSERT || MODIFY
export const indexData = async ({
  client,
  records,
}: {
  client: Client;
  records: Array<Record<string, any>>;
}) => {
  await Promise.all(
    records
      .map(({ newImage, index }) => ({
        id: newImage.id,
        title: newImage.title,
        publishDate: newImage.publishDate,
        description: newImage.description,
        tags: newImage.tags,
        // body: newImage.body,
        index,
      }))
      .map((document) =>
        client.index({
          id: document.id,
          index: document.index,
          body: filterNullishProperties(document),
        })
      )
  );
};

// REMOVE
export const removeData = async ({
  client,
  records,
}: {
  client: Client;
  records: Array<Record<string, any>>;
}) => {
  await Promise.all(
    records
      .map(({ oldImage, index }) => ({
        id: oldImage.id,
        index,
      }))
      .map((document) =>
        client.delete({
          id: document.id,
          index: document.index,
        })
      )
  );
};

const filterNullishProperties = (
  object: Record<string, any>
): Record<string, any> =>
  Object.fromEntries(
    Object.entries(object).filter(([, value]) => value != null)
  );
