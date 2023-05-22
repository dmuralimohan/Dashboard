/*
    Configuring users Database Scehema with credentials
*/

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

const userSchema = mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

userSchema.pre("save", async function(){
    const user = this;
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
});

userScehema.method.generateAuthToken = () => {
    const user = this;
    const authToken = jwt.sign({
        email: user.email
    }, config.AUTH_KEY, {expiresIn: "15m"});

    fastify.logger.info("Authentication token Generated Successfully AUTHTOKEN: "+ authToken);

    return authToken;
};

userSchema.method.verifyAuthToken = (token) => {
    const user = this;
    try{
        const decodedObj = jwt.verify(token, config.AUTH_KEY);
        if(decodedObj.email === user.email)
        {
            return true;
        }
        return false;
    }
    catch(err)
    {
        fastify.logger.error("Error occurred in verifying Authentication Token "+ err);

        return false;
    }
};

userScehema.method.generateRefreshToken = () => {
    const user = this;
    const refreshToken = jwt.sign({
        email: user.email
    }, config.REFRESH_AUTH_KEY, {expiresIn: "1d"});

    fastify.logger.info("Authentication token generated Successfully REFRESHTOKEN: "+ refreshToken);

    return refreshToken;
};

userSchema.method.verifyRefreshToken = (token) => {
    const user = this;
    try{
        const decodedObj = jwt.verify(token, config.REFRESH_AUTH_KEY);
        if(decodedObj.email === user.email)
        {
            return true;
        }
        return false;
    }
    catch(err)
    {
        if(err.name === "TokenExpiredError")
        {
            fastify.logger.error("Refresh Token is Expired");
            return reply.status(1002).send({
                message: "Refresh token is expired"
            });
        }
        
        fastify.logger.error("Error occurrred in verifying REFRESHTOKEN "+ err);

        return false;
    }
};

const User = mongoose.model("user", userSchema);

module.exports = User;