Assignment 1:

I developed a web application using nodejs and the database used is postgresSQL.

I used POSTMAN to do the API calls.

The RESTful API Endpoints implemented are

1. POST - to add new values to the table in the database POST is used. The values to be given in JSON are first_name, last_name, password and username. API address is http://localhost:3000/v1/user. The response for this call will be the id (generated automatically using sequelize), first_name, last_name, username, account_created (generated automatically) and account_updated(generated automatically). 
 
2. GET - to view all the values present in the table GET is used. Basic authorization is used to show the details of the user. Id of the particular user should be given the url and the username & password should match for the POSTMAN to show the response. API address will be http://localhost:3000/v1/user/{id} The response for this call will be the id (generated automatically using sequelize), first_name, last_name, username, account_created and account_updated.
 
3. PUT - to update the values like first_name, last_name and password PUT is used. username cannot be updated. Basic authorization should happen successfully when a user wants to update the values. API address will be http://localhost:3000/v1/user/{id}. The values that need to be updated should be given in the json format. The response for this call is the 'Data is Updated' message. When wrong username is given the error message shown is "ID and username does not match". When wrong password is given "Invalid Password"

All the values in rows in table format can be viewed using pgAdmin


Assignment 2:

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