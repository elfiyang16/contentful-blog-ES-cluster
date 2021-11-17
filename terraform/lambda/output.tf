
   
output "lambda_role_arn" {
  value = aws_iam_role.dynamo_stream_lambda_role.arn
}