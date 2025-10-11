resource "aws_s3_bucket" "catalog_frontend" {
    bucket = "catalog-frontend-bucket-sentry"
}

resource "aws_s3_bucket_website_configuration" "website" {
  bucket = aws_s3_bucket.catalog_frontend.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"
  }
}