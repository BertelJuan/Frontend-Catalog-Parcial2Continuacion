resource "aws_apigatewayv2_api" "catalog_api" {
    name = "catalog-api"
    protocol_type = "HTTP"
}

resource "aws_apigatewayv2_integration" "catalog_integration" {
  api_id = aws_apigatewayv2_api.catalog_api.id
  integration_type = "AWS_PROXY"
  integration_uri = aws_lambda_function.catalog_lambda.invoke_arn
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