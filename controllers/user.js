const { v4: uuidv4 } = require('uuid');
//const pool = require('../db');
const sequelize = require('../db');
const logger = require('../logging');
const statsD = require('node-statsd');
const {
    emailValidation,
    hashingOfPassword,
    basicAuthenticationHandler,
    passwordCheckFunction,
    randomStringAsBase64Url
} = require('../utils/controller.utility');

const users = require('../models/userModel');

let userFlag = false;

const { Sequelize, Model, DataTypes } = require('sequelize');
const { CommandCompleteMessage } = require('pg-protocol/dist/messages');


const metricCounter = new statsD();



//POST Method

const createUser = (request, response) => {

    var regexName = /^[a-zA-Z]+ [a-zA-Z]+$/;

    if(request.body.username){
    users.findOne({where:{username:request.body.username}}).then((result) => {

        let reqBody = request.body ? Object.keys(request.body) : null;
        if (!Object.keys(request.body).length) {
            return response.status(400).json('No Data Sent');
        }
    
        const result1 = reqBody.filter(el => el === 'account_created' || el === 'account_updated' || el === 'id');
        if (result1.length === 1) {
            return response.status(400).json('Only first_name, last_name, username, and password is required');
        }

        const { first_name, last_name, username, password } = request.body;

        const checkValidEmail = emailValidation(username);
    
        if (!first_name || !last_name || !username || !password || password.length < 8 || !first_name.length || !last_name.length) {
            return response.status(400).json("Incomplete Data");
        }

        else if(result) {
            response.status(400).send('Username Already Exists');
        }
        else if(!checkValidEmail){
            response.status(400).send('Enter valid email');
        }
     
        else {

            hashingOfPassword(request.body.password).then((hashPassword) => {

                users.create({
                    
                    first_name: request.body.first_name,
                    last_name: request.body.last_name,
                    username: request.body.username,
                    password: hashPassword,
                    account_created:new Date().toISOString(),
                    account_updated:new Date().toISOString()
                }).then((result) => {
                   // console.log(result.dataValues.password);
                    delete result.dataValues.password;
                    response.send(result);
                }).catch((error) => {
                    console.log(error);
                });
               
        
            });

        }
    });
}else {
    response.status(400).send('Incomplete Data');
}

 
}


// GET method

const getUser = (request, response) =>{
    const [username, password] = basicAuthenticationHandler(request);

        if (!username || !password) {
            return response.status(403).json("Please provide Username and Password");
        }

        users.findByPk(request.params.userId).then((result) => {

            const hashPassword = result.password;

            if(result.username == username){
            passwordCheckFunction(hashPassword, password)
            .then((valueToCompare) => {
                if (valueToCompare) {
                    
                    const data = result;
                    //delete data["User"]["dataV"];
                   // console.log(data);
                    // delete data["is_verified"];
                    delete data.dataValues.password;
                    console.log("Data fetch successful");
                    return response.status(200).json(data); 
                }   
                 else {
                    response.status(401).send('Invalid Password');
                 }
                
                })
            }else {
                response.status(400).send('ID and username does not match');
            }
                 
            }).catch((error) => {
                return response.status(401).json("Error Fetching Data");
                
            }); 

};
//PUT Method

const editUser = (request, response) => {
    const [username, password] = basicAuthenticationHandler(request);

    if (!username || !password) {
        return response.status(403).json("Please provide Username and Password");
    }

    intermediateMethodToUpdate(request, response, username);

    if(!userFlag){
    users.findByPk(request.params.userId).then((result) => {

        const hashPassword = result.password;

        if(result.username == username){
        passwordCheckFunction(hashPassword, password)
        .then((valueToCompare) => {
            if (valueToCompare) {
               
                if(result.id == request.params.userId){

                users.update(request.body, {where:{id: request.params.userId}}).then((updatedData) => {
                   // response.status(200).send(updatedData);
                    response.status(200).send('Data is Updated')
                    console.log('updated');
                }).catch((error)=> {
                    
                });

                users.update({account_updated:new Date().toISOString()},{where:{id: request.params.userId}});
                
                if(request.body.password){
                    hashingOfPassword(request.body.password).then((updated_hashPassword) => {
                        users.update({password:updated_hashPassword},{where:{id: request.params.userId}});
                    }).catch((error) => {
                        response.send('Error in updating password');
                    })
                
                }
                
            }else {
                response.status(403).send('Forbidden from accessing others Data');
            }

            }   
             else {
                response.status(401).send('Invalid Password');
             }
            
            })

        }else {
            response.status(400).send('ID and username does not match')
        }
             
        }).catch((error) => {
            return response.status(401).json("Error Fetching Data");
            
        }); 

    }


   


}

const intermediateMethodToUpdate = (request, response, username) => {
    const importantFields = ["first_name", "last_name", "password"];
    const RequestBodyKeys = request.body ? Object.keys(request.body) : null;
    let flag = true;
    if (!RequestBodyKeys || !RequestBodyKeys.length) {
        return response.status(400).json("Correct details are not provided for updation of information");
    }
    RequestBodyKeys.forEach(val => {
        if (importantFields.indexOf(val) < 0) {
            flag = false;
        }
    })
    if (!flag) {
        userFlag = true;
        return response.status(400).json("You can update FirstName, LastName and Password only!");
    }

    const account_updated = new Date().toISOString();
    const { first_name, last_name, password } = request.body;
    if ((password && password.length < 8) || (first_name && !first_name.length) || (last_name && !last_name.length)) {
        return response.status(400).json("Incorrect Credentials");
    }
    if (password) {
        hashingOfPassword(password)
            .then((hashPassword) => {
                
            })
    } else {
        
    }
}

const getHealth = (request, response) => {
    return response.status(200).json("Health is OK");
}


/**
 * Controller to handle the User details update.
 * @param {*} request 
 * @param {*} response 
 */

// const updatingUser = (request, response) => {
//     logger.info("User Update Put Call");
//     metricCounter.increment('PUT/v1/account/accountID');
//     const [username, password] = basicAuthenticationHandler(request);

//     if (!username || !password) {
//         return response.status(403).json("Invalid Details");
//     }

//     let queries = "SELECT * FROM users WHERE username = $1";
//     let values = [username];

//     pool.query(queries, values)
//         .then(result => {
//             if (result.rowCount) {
//                 const {
//                     password: hashPassword
//                 }
//                     = result.rows[0];
//                 passwordCheckFunction(hashPassword, password)
//                     .then(valueToCompare => {
//                         if (valueToCompare) {
//                             intermediateMethodToUpdate(request, response, username);
//                         } else {
//                             return response.status(401).json("Invalid Password");
//                         }
//                     })
//             } else {
//                 return response.status(401).json("Invalid Username");
//             }
//         })
//         .catch(err => {
//             return response.status(400).json(err.message)
//         })
// }

/**
 * Controller to retrieve user from Db
 * @param {*} request 
 * @param {*} response 
 */



module.exports = {
    createUser,
    getUser,
    editUser,
    getHealth
 
}
