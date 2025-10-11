resource "aws_iam_role" "lambda_exec_role" {
  name = "lambda-exec-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
        {
            Action = "sts:AssumeRole"
            Effect = "Allow"
            Principal = {
                Service = "lambda.amazonaws.com"
            }
        }
    ]
  })
}

resource "aws_iam_role_policy" "lambda_s3_read_policy" {
    name = "lambda-s3-read-policy"
    role = aws_iam_role.lambda_exec_role.id

    policy = jsonencode({
        Version = "2012-10-17"
        Statement = [
            {
                Action = [
                    "s3:GetObject",
                    "s3:ListBucket"
                ]
                Effect = "Allow"
                Resource = [
                    "arn:aws:s3:::catalogo-datos-bucket",
                    "arn:aws:s3:::catalogo-datos-bucket/*"
                ]
            }
        ]
    })
}