resource "aws_apigatewayv2_api" "catalog_api" {
    name = "catalog-api"
    protocol_type = "HTTP"

    cors_configuration {
      allow_origins = ["*"]
      allow_methods = ["GET", "POST", "OPTIONS"]
      allow_headers = ["*"]
    }
}

resource "aws_apigatewayv2_stage" "catalog_stage" {
  api_id = aws_apigatewayv2_api.catalog_api.id
  name = "prod"
  auto_deploy = true
}

resource "aws_apigatewayv2_integration" "catalog_integration" {
  api_id = aws_apigatewayv2_api.catalog_api.id
  integration_type = "AWS_PROXY"
  integration_uri = aws_lambda_function.catalog_lambda.invoke_arn
  integration_method     = "POST"
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "catalog_route" {
    api_id = aws_apigatewayv2_api.catalog_api.id
    route_key = "GET /catalog"
    target = "integrations/${aws_apigatewayv2_integration.catalog_integration.id}"
}

resource "aws_lambda_permission" "catalog_api_permission" {
  statement_id = "AllowAPIGatewayInvoke"
  action = "lambda:InvokeFunction"
  function_name = aws_lambda_function.catalog_lambda.function_name
  principal = "apigateway.amazonaws.com"
}

resource "aws_apigatewayv2_integration" "catalog_update_integration" {
  api_id = aws_apigatewayv2_api.catalog_api.id
  integration_type = "AWS_PROXY"
  integration_uri = aws_lambda_function.catalog_update.invoke_arn
  integration_method = "POST"
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "catalog_update_route" {
  api_id = aws_apigatewayv2_api.catalog_api.id
  route_key = "POST /catalog/update"
  target = "integrations/${aws_apigatewayv2_integration.catalog_update_integration.id}"
}

resource "aws_lambda_permission" "catalog_update_permission" {
  statement_id = "AllowAPIGatewayInvokeUpdate"
  action = "lambda:InvokeFunction"
  function_name = aws_lambda_function.catalog_update.function_name
  principal = "apigateway.amazonaws.com"
  source_arn = "${aws_apigatewayv2_api.catalog_api.execution_arn}/*/*"
}