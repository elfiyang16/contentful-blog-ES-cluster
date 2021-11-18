output "dynamo_dynamo_stream_arn" {
  value = module.TransactionsTable.streamArn
}

output "es_domain_arn" {
  value = module.EsDomain.domain_arn
}

output "es_domain_id" {
  value = module.EsDomain.domain_id
}

output "es_kibana_host" {
  value = module.EsDomain.domain_kebana_host
}