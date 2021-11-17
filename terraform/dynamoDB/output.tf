output "streamArn" {
  value = aws_dynamodb_table.contentful_table.stream_arn
}

output "table_name" {
  value = aws_dynamodb_table.contentful_table.name
}