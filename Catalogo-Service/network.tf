resource "aws_vpc" "main" {
    cidr_block = "10.0.0.0/16"
    enable_dns_support = true
    enable_dns_hostnames = true

    tags = {
      Name = "catalogo-vpc"
    }
}

resource "aws_subnet" "main_a" {
    vpc_id = aws_vpc.main.id
    cidr_block = "10.0.1.0/24"
    availability_zone = "us-east-1a"
    map_public_ip_on_launch = true

    tags = {
      Name = "catalogo-subnet-a"
    }
}

resource "aws_vpc_endpoint" "s3_endpoint" {
  vpc_id = aws_vpc.main.id
  service_name = "com.amazonaws.us-east-1.s3"
  route_table_ids = [aws_vpc.main.main_route_table_id]
}