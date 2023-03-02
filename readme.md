***************************Assignment 1:***************************

I developed a web application using nodejs and the database used is postgresSQL.

I used POSTMAN to do the API calls.

The RESTful API Endpoints implemented are

1. POST - to add new values to the table in the database POST is used. The values to be given in JSON are first_name, last_name, password and username. API address is http://localhost:3000/v1/user. The response for this call will be the id (generated automatically using sequelize), first_name, last_name, username, account_created (generated automatically) and account_updated(generated automatically). 
 
2. GET - to view all the values present in the table GET is used. Basic authorization is used to show the details of the user. Id of the particular user should be given the url and the username & password should match for the POSTMAN to show the response. API address will be http://localhost:3000/v1/user/{id} The response for this call will be the id (generated automatically using sequelize), first_name, last_name, username, account_created and account_updated.
 
3. PUT - to update the values like first_name, last_name and password PUT is used. username cannot be updated. Basic authorization should happen successfully when a user wants to update the values. API address will be http://localhost:3000/v1/user/{id}. The values that need to be updated should be given in the json format. The response for this call is the 'Data is Updated' message. When wrong username is given the error message shown is "ID and username does not match". When wrong password is given "Invalid Password"

All the values in rows in table format can be viewed using pgAdmin


*************************Assignment 2:***********************

I used POSTMAN to do the API calls.

The RESTful API Endpoints implemented are

1. POST - to add new products to the table in the database POST is used. The values to be given in JSON are name, description, sku, manufacturer and quantity. API address is http://localhost:3000/v1/product. If any one field is missing then the error message is "Incomplete Data". Basic authorization is used to check if the user exists. Only existing/authorized users can post the products.
 
2. GET - to view all the values present in the table GET is used. sku of the particular product should be given in the url for the POSTMAN to show the response. API address will be http://localhost:3000/v1/product/{sku}. no authentication is done here.
 
3. PUT/PATCH - to update the values like name, description, sku, quantity and manufacturer PUT/PATCH is used. sku should be a unique value. Basic authorization should happen successfully when a user wants to update the values. API address will be http://localhost:3000/v1/product/{sku}. The values that need to be updated should be given in the json format. The response for this call is the 'Data is Updated' message. Only user who creates the product can update the details

4. DELETE - to delete the row in the table products basic authentication have to be successful and only user who creates the product can delete it. API address will be http://localhost:3000/v1/product/{sku}

All the values in rows in table format can be viewed using pgAdmin

Steps to run the project:

1. Clone the github repository.
2. In VS Code, open the folder and run npm install which will install all the dependencies.
3. In order to run the application, open a terminal and run command "npm start".

*************************Assignment 4:***********************

Prerequisites: The web application has been built using nodeJS, PostgresSql as the database. The APIs implemented are GET, POST and PUT as per the given requirements.
Packer to be installed and added to the environment variables path
The API's can be tested with the Postman with the correct routes as configured.

Requirements and Description: The payload will be sent in JSON format in the body of the request. No UI has been implemented in this application.
The API calls will return proper HTTP status codes
A packer template is written in pkr.hcl format with the required provisioner files like the node.sh, postgres.sh to validate and build the packer with the configured local source directory and remote destination directory. Also added under provisioner files are the zip of the webapp and the systemd service file with the commands to execute and start the ec2 server for the ec2-user


Steps to run the project:

1. Raise a pull request from the fork branch to the organization main in the webapp repository with any small change
2. The above PR will trigger a github workflow to merge pull which will inturn start the actions to invoke the packer file to run the ami.pkr.hcl.
3. The successful completion of actions will result in an AMI being created in the dev aws console as per the github secret keys and variables set.
4. The AMI created is to be copied on to the var.tfvars of the clones aws-infra repository.
5. Terraform apply command with var.tfvars file will create the ec2 instance in the dev/demo aws console account as per required inputs with the associated AMI created.
6. The AMI created in dev is also shared with the demo account using the account id configured while running the packer template file.
7. The public IP is to be copies onto the postman and run the APIs as required to test the application functionalities
8. A server is setup in localhost on port 3000 as default. The port environment variable can be configured as required before running the server.
9. To test the API end points, open Postman and execute the below 
    POST API
   1. Configure the method as 'POST' Enter http://{public_IP_of_EC2}:3000/v1/user in the request url
   2. Add first_name, last_name, username (email id), password in the json format in the request body and click send.
   3. The details entered except for the password are displayed in the response along with additional autogenerated fields like id, account_created and account_updated

    GET API
   4. Configure the method as 'GET' Enter http://{public_IP_of_EC2}:3000/v1/user/{ID} in the request url
   5. Set the authorization to basic authentication and enter the registered username as the email id and the password
   6. Also, add the id of the user in the url and click send to get the data

    PUT API
  1. Configure the method as 'PUT' Enter http://{public_IP_of_EC2}:3000/v1/user/{ID} in the request url
   2. Set the authorization to basic authentication and enter the registered username as the email id and the password
   3. Also, add the id of the user in the url
   4. The user will only be able to update the first_name, last_name and the password.
   5. Click send to update the data in the database
   6. The data will get updated in the table as requested


The RESTful API Endpoints implemented for products are

1. POST - to add new products to the table in the database POST is used. The values to be given in JSON are name, description, sku, manufacturer and quantity. API address is http://{public_IP_of_EC2}:3000/v1/product. If any one field is missing then the error message is "Incomplete Data". Basic authorization is used to check if the user exists. Only existing/authorized users can post the products.
 
2. GET - to view all the values present in the table GET is used. sku of the particular product should be given in the url for the POSTMAN to show the response. API address will be http://{public_IP_of_EC2}:3000/v1/product/{sku}. no authentication is done here.
 
3. PUT/PATCH - to update the values like name, description, sku, quantity and manufacturer PUT/PATCH is used. sku should be a unique value. Basic authorization should happen successfully when a user wants to update the values. API address will be http://{public_IP_of_EC2}:3000/v1/product/{sku}. The values that need to be updated should be given in the json format. The response for this call is the 'Data is Updated' message. Only user who creates the product can update the details

4. DELETE - to delete the row in the table products basic authentication have to be successful and only user who creates the product can delete it. API address will be http://{public_IP_of_EC2}:3000/v1/product/{sku}

*************************Assignment 5*************************