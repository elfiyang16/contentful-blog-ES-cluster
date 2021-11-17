locals {
  lambda_func_name = "contentfulDynamoStreamToES"
}

data "aws_caller_identity" "current" {}

resource "aws_iam_role_policy" "dyanmo_stream_lambda_policy" {
  role = aws_iam_role.dynamo_stream_lambda_role.id

  policy = <<-EOF
  {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": "lambda:InvokeFunction",
            "Resource": "arn:aws:lambda:${var.aws_region}:${data.aws_caller_identity.current.account_id}:function:${local.lambda_func_name}*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents"
            ],
            "Resource": "arn:aws:logs:${var.aws_region}:${data.aws_caller_identity.current.account_id}:*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "dynamodb:DescribeStream",
                "dynamodb:GetRecords",
                "dynamodb:GetShardIterator",
                "dynamodb:ListStreams"
            ],
            "Resource": "${var.stream_arn}"
        },
        {
            "Effect": "Allow",
            "Action": [
                "es:ESHttpGet",
                "es:ESHttpPost",
                "es:ESHttpPut",
                "es:ESHttpDelete"
            ],
            "Resource": "${var.domain_arn}"
        }
    ]
  }
  EOF
}

data "aws_iam_policy_document" "dynamo_stream_lambda_role" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRole"]
    principals {
      type       = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}


# resource "aws_iam_role" "dynamo_stream_lambda_role" {
#   name = "dynamo_stream_lambda_role"

#   assume_role_policy = <<-EOF
#   {
#     "Version": "2012-10-17",
#     "Statement": [
#       {
#         "Action": "sts:AssumeRole",
#         "Principal": {
#           "Service": "lambda.amazonaws.com"
#         },
#         "Effect": "Allow",
#         "Sid": ""
#       }
#     ]
#   }
#   EOF
# }
resource "aws_iam_role" "dynamo_stream_lambda_role" {
  name = "dynamo_stream_lambda_role"
  assume_role_policy = data.aws_iam_policy_document.dynamo_stream_lambda_role.json
}

resource "aws_lambda_function" "process_dynamo_stream_function" {
  function_name = local.lambda_func_name
  handler = "index.handler"
  role = aws_iam_role.dynamo_stream_lambda_role.arn
  runtime = "nodejs12.x"
  timeout          = 60
  environment {
    variables = {
    REGION = var.aws_region
      ES_HOST = var.es_host
      AWS_ACCESS_KEY_ID = var.accessKeyId
      AWS_SECRET_ACCESS_KEY= var.secretAccessKey
    }
  }

  filename      = "./lambdaFunc.zip"
  source_code_hash = filebase64sha256("./lambdaFunc.zip")
}

resource "aws_lambda_event_source_mapping" "stream_function_event_trigger" {
  event_source_arn  = var.stream_arn
  function_name     = aws_lambda_function.process_dynamo_stream_function.arn
  starting_position = "LATEST"
  depends_on        = [aws_iam_role.dynamo_stream_lambda_role]

}