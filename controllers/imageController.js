const sequelize = require('../db');
const logger = require('../logging');
const uuid = require('uuid');
const res = require('../utils/responseLib');
const statsD = require('node-statsd');
const {
    emailValidation,
    hashingOfPassword,
    basicAuthenticationHandler,
    passwordCheckFunction,
    randomStringAsBase64Url
} = require('../utils/controller.utility');

const path = require("path");

const products = require('../models/productModel');
const users = require('../models/userModel');
const images = require('../models/imageModel');
const { response } = require('../app');
const fileUpload = require('express-fileupload');
const express = require('express');
const app = express();
const fs = require('fs');
const AWS = require('aws-sdk');
const multer = require('multer');
const json = express.json();
app.use(multer);

const upload = multer({ dest: "upload/" })
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
}))

const metricCounter = new statsD('localhost', 8125);


// const SESConfig = {
//     apiVersion: "2010-12-01",
//     profile:process.env.AWS_PROFILE,
//     accessKeyId: process.env.AWS_ACCESS_KEY,
//     accessSecretKey: process.env.AWS_SECRET,
//     region: "us-east-1"
//  }




//AWS.config.update(SESConfig);

const createProductImage = (request, response) => {
    metricCounter.increment("createProductImage");

    const uniqueId = uuid.v4();

    const [username, password] = basicAuthenticationHandler(request);

    if (!username || !password) {
        return response.status(401).json("Please provide Username and Password");
    }

    console.log(request.file);
    // const img = fs.readFileSync('./controllers/download.jpg');

    users.findOne({ where: { username: username } }).then((user) => {

        if (user) {

            products.findOne({ where: { id: request.params.productId } }).then((record) => {
                if (record) {
                    if (record.owner_user_id == user.id) {

                        const hashPassword = user.password;

                        passwordCheckFunction(hashPassword, password).then((valueToCompare) => {
                            if (valueToCompare) {

                                if (request.file) {

                                    // const checkFileType = function (file, cb) {
                                    //     //Allowed file extensions
                                    //     const fileTypes = /jpeg|jpg|png|gif|svg/;

                                    //     //check extension names
                                    //     const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());

                                    //     const mimeType = fileTypes.test(file.mimetype);

                                    //     if (mimeType && extName) {
                                    //         return cb(null, true);
                                    //     } else {
                                    //         cb("Error: You can Only Upload Images!!");
                                    //     }
                                    // };

                                    if (request.file.mimetype != 'image/jpeg' && request.file.mimetype != 'image/png' && request.file.mimetype != 'image/jpg') {
                                        logger.warn("Upload format incorrect");
                                        return response.status(400).send({
                                            message: 'Uploaded format incorrect'
                                        });
                                    }

                                    const UploadParams = {
                                        Bucket: process.env.S3_BUCKET_NAME,
                                        Key: `${request.params.productId}/${request.file.originalname}--${uniqueId}`,
                                        Body: Buffer.from(request.file.path),
                                        ContentType: request.file.mimetype,
                                        ACL: 'private'
                                    }

                                    s3.upload(UploadParams, function (err, data) {
                                        err && console.log("Error", err)
                                        data && console.log("upload success", data.Location)
                                        console.log(data)

                                        const newImage = {
                                            product_id: request.params.productId,
                                            file_name: `${request.file.originalname}--${uniqueId}`,
                                            //file_name:s3Key,
                                            date_created: new Date().toISOString(),
                                            s3_bucket_path: data.Location

                                        };
                                        images.create(newImage).then(result => {
                                            logger.info("Image uploaded");
                                            response.status(201).send(result);
                                        })
                                            .catch(error => {
                                                console.log(error)
                                            });


                                    })

                                } else {
                                    logger.warn("No file uploaded");
                                    response.status(400).send("No file Uploaded");
                                }

                            } else {
                                response.status(401).send(res.generate(true, 'Invalid Password', 401, {}));
                            }
                        });

                    } else {
                        response.status(403).send('Product not added by ' + user.username);
                    }
                } else {
                    response.status(404).send('Product with productId ' + request.params.productId + " does not exist");
                }

            })


        } else {
            logger.error("No user found");
            response.status(401).send('No user found');
        }

    });





}



const getAllProductImages = (request, response) => {

    metricCounter.increment("getAllProductImages");

    const [username, password] = basicAuthenticationHandler(request);

    if (!username || !password) {
        return response.status(401).json("Please provide Username and Password");
    }

    users.findOne({ where: { username: username } }).then((user) => {

        if (user) {

            products.findOne({ where: { id: request.params.productId } }).then((record) => {
                if (record) {
                    if (record.owner_user_id == user.id) {

                        const hashPassword = user.password;

                        passwordCheckFunction(hashPassword, password).then((valueToCompare) => {
                            if (valueToCompare) {

                                images.findAll({ where: { product_id: request.params.productId } }).then(result => {
                                    // console.log(result);
                                    logger.info("Fetched all images");
                                    response.status(200).send(result);

                                }).catch(error => {
                                    console.log(error);
                                });

                            } else {
                                response.status(401).send(res.generate(true, 'Invalid Password', 401, {}));
                            }
                        });

                    } else {
                        response.status(403).send('Product not added by ' + user.username);
                    }
                } else {
                    response.status(404).send('Product with productId ' + request.params.productId + " does not exist");
                }

            })



        } else {
            response.status(404).send('No user found');
        }

    });




}

const getProductImage = (request, response) => {

    metricCounter.increment("getProductImage");
    const [username, password] = basicAuthenticationHandler(request);

    if (!username || !password) {
        return response.status(401).json("Please provide Username and Password");
    }

    users.findOne({ where: { username: username } }).then((user) => {

        if (user) {

            products.findOne({ where: { id: request.params.productId } }).then((record) => {
                if (record) {
                    if (record.owner_user_id == user.id) {

                        const hashPassword = user.password;

                        passwordCheckFunction(hashPassword, password).then((valueToCompare) => {
                            if (valueToCompare) {

                                images.findByPk(

                                    request.params.imageId

                                ).then(result => {
                                    if (result) {
                                        // console.log(result);
                                        if (result.product_id == request.params.productId) {
                                            logger.info("Image with id " + request.params.imageId + ' fetched');
                                            response.status(200).send(result);
                                        } else {
                                            response.status(404).send("Image not found");
                                        }

                                    } else {
                                        response.status(404).send('Image with id ' + request.params.imageId + ' not found');
                                    }

                                }).catch(error => {
                                    console.log(error);
                                });

                            } else {
                                response.status(401).send(res.generate(true, 'Invalid Password', 401, {}));
                            }
                        });

                    } else {
                        response.status(403).send('Product not added by ' + user.username);
                    }
                } else {
                    response.status(404).send('Product with productId ' + request.params.productId + " does not exist");
                }

            })



        } else {
            response.status(404).send('No user found');
        }

    });



}

const deleteProductImage = async (request, response) => {

    metricCounter.increment("deleteProductImage");

    const [username, password] = basicAuthenticationHandler(request);

    if (!username || !password) {
        return response.status(401).json("Please provide Username and Password");
    }

    console.log(request.file);
    // const img = fs.readFileSync('./controllers/download.jpg');

    users.findOne({ where: { username: username } }).then((user) => {
        debugger;
        if (user) {

            products.findOne({ where: { id: request.params.productId } }).then((record) => {
                if (record) {
                    if (record.owner_user_id == user.id) {

                        const hashPassword = user.password;

                        passwordCheckFunction(hashPassword, password).then(async (valueToCompare) => {
                            if (valueToCompare) {

                                const imageId = await getImageId(request.params.imageId);
                                // console.log("hello");
                                //  console.log(!imageId);
                                if (!imageId) {
                                    logger.error("image not found");
                                    return response.status(404).json({
                                        message: 'Image not found'
                                    });
                                }
                                const filename = imageId.file_name

                                console.log(filename);

                                var deleteParam = {
                                    Bucket: process.env.S3_BUCKET_NAME,
                                    Key: `${request.params.productId}/${filename}`

                                };

                                s3.deleteObject(deleteParam, function (err, data) {

                                    data && console.log("delete success", data.Location)


                                    const image_id = request.params.imageId;

                                    images.findByPk(image_id).then((image) => {
                                        if (image.product_id == request.params.productId) {

                                            images.destroy({
                                                where: {
                                                    image_id: image_id
                                                }
                                            }).then(result => {
                                                images.findAll({
                                                    where: {
                                                        image_id: image_id
                                                    }
                                                }).then(result => {
                                                    logger.info("Image Deleted");
                                                    response.status(204).send(result);

                                                })
                                            }).catch(error => {
                                                console.log(error);
                                            });

                                        } else {
                                            response.status(404).send("Image not found");
                                        }
                                    })





                                });

                            } else {
                                response.status(401).send(res.generate(true, 'Invalid Password', 401, {}));
                            }
                        });

                    } else {
                        logger.error("product not added by this user");
                        response.status(403).send('Product not added by ' + user.username);
                    }
                } else {
                    response.status(404).send('Product with productId ' + request.params.productId + " does not exist");
                }

            })


        } else {
            response.status(401).send('No user found');
        }

    });





}

const getImageId = async (image_id) => {
    return await images.findOne({
        where: {
            image_id: image_id
        }
    });

};

const getProductId = async (id) => {
    return await products.findOne({
        where: {
            id: id
        }
    });

};

module.exports = {
    createProductImage,
    getAllProductImages,
    getProductImage,
    deleteProductImage,

}