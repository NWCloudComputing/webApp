variable "aws_access_key" {
  type    = string
  default = "AKIAQMMLKDOGPRPBYOKU"
}

variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "aws_secret_key" {
  type    = string
  default = "AQwIbBDoYTVel6ar4ZhrwalhfE5YCjjiLa+JmPPH"
}

data "amazon-ami" "awsdev-ami" {
  access_key = "${var.aws_access_key}"
  filters = {
    name                = "amzn2-ami-hvm-*"
    root-device-type    = "ebs"
    virtualization-type = "hvm"
  }
  most_recent = true
  owners      = ["amazon"]
  region      = "${var.aws_region}"
  secret_key  = "${var.aws_secret_key}"
}

source "amazon-ebs" "ami" {
  access_key    = "${var.aws_access_key}"
  ami_name      = "webapp"
  ami_users     = [608454289209]
  instance_type = "t2.micro"
  region        = "${var.aws_region}"
  secret_key    = "${var.aws_secret_key}"
  source_ami    = "${data.amazon-ami.awsdev-ami.id}"
  ssh_username  = "ec2-user"
  tags = {
    Name = "AMI"
  }
}

build {
  sources = ["source.amazon-ebs.ami"]

  provisioner "shell" {
    inline = ["sudo mkdir -p /home/ec2-user/scripts", "sudo chown -R ec2-user:ec2-user /home/ec2-user/scripts", "sudo chmod -R 755 /home/ec2-user/scripts"]
  }

  provisioner "file" {
    destination = "/tmp/node.service"
    source      = "../service/node.service"
  }

  provisioner "file" {
    destination = "/home/ec2-user/webapp.zip"
    source      = "../webapp.zip"
  }

  provisioner "file" {
    destination = "/home/ec2-user/scripts/postgres.sh"
    source      = "tmp/postgres.sh"
  }

  provisioner "file" {
    destination = "/home/ec2-user/scripts/node.sh"
    source      = "tmp/node.sh"
  }

  provisioner "shell" {
    inline = ["sudo chmod o+x /home/ec2-user/scripts/node.sh", "sudo /home/ec2-user/scripts/node.sh", "sudo chmod o+x /home/ec2-user/scripts/postgres.sh", "sudo /home/ec2-user/scripts/postgres.sh"]
  }

  provisioner "shell" {
    inline = ["rpm -Va --nofiles --nodigest"]
  }

}