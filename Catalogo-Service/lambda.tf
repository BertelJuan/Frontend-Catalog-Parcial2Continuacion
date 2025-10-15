resource "aws_lambda_function" "catalog_lambda" {
    depends_on = [aws_elasticache_cluster.redis]

    function_name = "catalog-lambda"
    handler = "index.handler"
    runtime = "nodejs20.x"

    filename = "${path.module}/catalog-lambda/catalog-lambda.zip"
    source_code_hash = filebase64sha256("${path.module}/catalog-lambda/catalog-lambda.zip")

    role = aws_iam_role.lambda_exec_role.arn
    timeout = 10
    memory_size = 128

    vpc_config {
      subnet_ids = [aws_subnet.main_a.id]
      security_group_ids = [aws_security_group.lambda_sg.id]
    }
    environment {
      variables = {
        BUCKET_NAME = "catalogo-datos-bucket"
        FILE_KEY = "productos.xlsx"
        REDIS_HOST = aws_elasticache_cluster.redis.cache_nodes[0].address
      }
    }

}

resource "aws_lambda_function" "catalog_update" {
  depends_on = [aws_elasticache_cluster.redis]
  function_name = "catalog-update"
  handler = "index.handler"
  runtime = "nodejs20.x"

  filename = "${path.module}/update-lambda/update-lambda.zip"
  source_code_hash = filebase64sha256("${path.module}/update-lambda/update-lambda.zip")

  role = aws_iam_role.lambda_exec_role.arn
  timeout = 30
  memory_size = 128

  vpc_config {
    subnet_ids = [aws_subnet.main_a.id]
    security_group_ids = [aws_security_group.lambda_sg.id]
  }
  environment {
    variables = {
    BUCKET_NAME = "catalogo-datos-bucket"
    FILE_KEY = "productos.xlsx"
    REDIS_HOST = aws_elasticache_cluster.redis.cache_nodes[0].address
    }
  }
}

resource "aws_security_group" "lambda_sg" {
  name        = "lambda-sg"
  description = "Permite a Lambda conectarse a Redis"
  vpc_id      = aws_vpc.main.id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "redis_sg" {
  name        = "redis-sg"
  description = "Permite conexion desde Lambda"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port       = 6379
    to_port         = 6379
    protocol        = "tcp"
    security_groups = [aws_security_group.lambda_sg.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
