resource "aws_lambda_function" "catalog_lambda" {
    function_name = "catalog-lambda"
    handler = "index.handler"
    runtime = "nodejs18.x"

    filename = "${path.module}/catalog-lambda/catalog-lambda.zip"
    source_code_hash = filebase64sha256("${path.module}/catalog-lambda/catalog-lambda.zip")

    role = aws_iam_role.lambda_exec_role.arn
    timeout = 10
    memory_size = 128

    environment {
      variables = {
        BUCKET_NAME = "catalogo-datos-bucket"
        FILE_KEY = "productos.xlsx"
      }
    }
}