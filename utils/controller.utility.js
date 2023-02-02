const bcrypt = require('bcrypt');
const crypto = require('crypto');
const base64url = require('base64url');

exports.emailValidation = (userEmail) => {
    const emailValidator = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailValidator.test(userEmail);
}

exports.hashingOfPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    } catch (error) {
        console.log(error)
    }
}

exports.passwordCheckFunction = async (hashPassword, password) => {
    return await bcrypt.compare(password, hashPassword);
}

exports.basicAuthenticationHandler = (req) => {
    const auth = req.headers.authorization;
    if (!auth || auth.indexOf('Basic ') === -1) return "Forbidden Request"
    const base64Credentials = auth.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    return credentials.split(':');
}

exports.randomStringAsBase64Url = (size) => {
    return base64url(crypto.randomBytes(size));
}