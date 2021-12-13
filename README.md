### Contentful DynamoDB Stream To ElasticSearch

This is the search engine for my blog site, in TypeScript.

After the ETL pipeline( aws-medium-contenful ) runs, blogs will be pushed to DynamoDB which will trigger a stream to ElasticSearch.

![elasticsearch](https://user-images.githubusercontent.com/29664811/145850343-840564f2-9403-499d-b044-7f7315b53512.png)

#### Infrastructure and Structure

Code is provisioned through Terraform.

Upon write to DynamoDB, a stream will send the new/old image of the data record to a lambda function, which will divide the events into `index` and `delete` buckets depends on the type of write actions.

Then the lambda will invoke the ElasticSearch to map the record using the mapping below:

```
id: newImage.id,
title: newImage.title,
publishDate: newImage.publishDate,
description: newImage.description,
tags: newImage.tags,

```

To run the deployment, see `build` script in `package.json`.

Note that the code is deployed on Terraform cloud, so you may need to to change the `terraform/main.tf` file on the `backend` block depends on your needs.
