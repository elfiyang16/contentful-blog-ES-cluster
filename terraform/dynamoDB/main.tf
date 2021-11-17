resource "aws_dynamodb_table" "contentful_table" {
  name = "ContentfulBlog"
  hash_key = "id"
  range_key = "publishDate"
  write_capacity = 10
  read_capacity = 10


  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "title"
    type = "S"
  }

  attribute {
    name = "description"
    type = "S"
  }

  attribute {
    name = "publishDate"
    type = "N"
  }

  attribute { // event a list, but just need to define the underlying data structure
    name = "tags"
    type = "S"
  }
  
#   global_secondary_index {
#     name            = "tags-index"
#     hash_key        = "tags"
#     projection_type = "ALL"
#   }

  stream_enabled = true

  stream_view_type = "NEW_AND_OLD_IMAGES"
}