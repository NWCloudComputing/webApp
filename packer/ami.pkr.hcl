
variable "aws_access_key" {
  type    = string
  default = ""
}

variable "aws_region" {
  type    = string
  default = ""
}

variable "aws_secret_key" {
  type    = string
  default = ""
}

variable "source_ami" {
  type    = string
  default = "ami-0dfcb1ef8550277af"
}

variable "ssh_username" {
  type    = string
  default = "ec2-user"
}

variable "demo_accountid" {
  type    = string
  default = "181600461636"
}

data "amazon-ami" "awsdev_ami" {
  // id = "${var.source_ami}"
  access_key = "${var.aws_access_key}"
  //access_key = env(AWS_ACCESS_KEY_ID)
  filters = {
    name                = "amzn2-ami-hvm-*"
    root-device-type    = "ebs"
    virtualization-type = "hvm"
  }
  most_recent = true
  owners      = ["amazon"]
  region      = "${var.aws_region}"
  //region = env(AWS_REGION)
  secret_key = "${var.aws_secret_key}"
  //secret_key = env(AWS_SECRET_ACCESS_KEY)
}

locals {
  timestamp = regex_replace(timestamp(), "[- TZ:]", "")
}


source "amazon-ebs" "Custom_AMI" {
  access_key    = "${var.aws_access_key}"
  ami_name      = "Aws_AMI-${local.timestamp}"
  ami_users     = ["${var.demo_accountid}"]
  instance_type = "t2.micro"
  region        = "${var.aws_region}"
  secret_key    = "${var.aws_secret_key}"
  source_ami    = "${data.amazon-ami.awsdev_ami.id}"
  ssh_username  = "${var.ssh_username}"
  tags = {
    Name = "Custom AMI"
  }
}

build {
  sources = ["source.amazon-ebs.Custom_AMI"]




  provisioner "shell" {
    inline = ["cd /home/ec2-user", "mkdir script"]
  }

  provisioner "file" {
    destination = "/home/ec2-user/script/"
    source      = "../webApp.zip"
  }

  provisioner "file" {
    destination = "/tmp/node.sh"
    source      = "tmp/node.sh"
  }

  provisioner "file" {
    destination = "/tmp/cloudwatch.sh"
    source      = "tmp/cloudwatch.sh"
  }

  provisioner "shell" {
    inline = ["sudo chmod +x /tmp/node.sh", "sudo /tmp/node.sh"]
  }

  provisioner "shell" {
    inline = ["sudo chmod +x /tmp/cloudwatch.sh", "sudo /tmp/cloudwatch.sh"]
  }

  provisioner "file" {
    destination = "/tmp/node.service"
    source      = "../service/node.service"
  }

  provisioner "shell" {
    inline = ["sudo mv /tmp/node.service /etc/systemd/system/node.service"]
  }


  provisioner "shell" {
    inline = ["sudo chown root:root /etc/systemd/system/node.service", "sudo chmod 644 /etc/systemd/system/node.service", "sudo systemctl daemon-reload", "sudo systemctl enable node.service", "sudo systemctl start node.service"]
  }

  #for cloudwatch agent and aws logs
  //  provisioner "shell" {

  //     inline = [
  //       "curl https://s3.amazonaws.com/aws-cloudwatch/downloads/latest/awslogs-agent-setup.py -O",
  //       "chmod +x ./awslogs-agent-setup.py",
  //       "./awslogs-agent-setup.py --region us-east-1 --non-interactive --configfile awslogs.conf"
  //     ]
  //   }

  provisioner "shell" {
    inline = ["sudo chmod o+x /tmp/cloudwatch.sh", "sudo /tmp/cloudwatch.sh"]
  }


  provisioner "shell" {
    inline = ["rpm -Va --nofiles --nodigest"]
  }

}
