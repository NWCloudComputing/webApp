Assignment 1:

I developed a web application using nodejs and the database used is postgresSQL.

I used POSTMAN to do the API calls.

The RESTful API Endpoints implemented are

1. POST - to add new values to the table in the database POST is used. The values to be given in JSON are first_name, last_name, password and username. API address is http://localhost:3000/v1/user. The response for this call will be the id (generated automatically using sequelize), first_name, last_name, username, account_created (generated automatically) and account_updated(generated automatically).
 
2. GET - to view all the values present in the table GET is used. Basic authorization is used to show the details of the user. Id of the particular user should be given the url and the username & password should match for the POSTMAN to show the response. API address will be http://localhost:3000/v1/user/{id} The response for this call will be the id (generated automatically using sequelize), first_name, last_name, username, account_created and account_updated.
 
3. PUT - to update the values like first_name, last_name and password PUT is used. username cannot be updated. Basic authorization should happen successfully when a user wants to update the values. API address will be http://localhost:3000/v1/user/{id}. The values that need to be updated should be given in the json format. The response for this call is the 'Data is Updated' message.

All the values in rows in table format can be viewed using pgAdmin