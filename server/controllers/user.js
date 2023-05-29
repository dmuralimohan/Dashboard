/*
    Control all the user Routes with corresponding requests and responses
*/

const bcrypt = require('bcrypt');


const User = require('../models/user');
const logger = require('../plugins/fastify').logger;

async function signIn(request, reply) {
    try{
        logger.info(`Data is received: ${JSON.stringify(request.body.data)}`);
        const { username, password } = request.body.data;
        logger.info(`User has sign in request ${username}`);
        console.log("UserName: "+ username);
        if(!username || !password){
            return reply.code(401).send("Invalid Credentials");
        }

        const user = User.getUserByEmail(username);
        if(!user.email && !user.password){
            logger.info(`User not found Email id: ${username}`);
            return reply.code(404).send({error: "User Not Found"});
        }
        console.log("hashed value: "+ JSON.stringify(user));

        const isMatch = bcrypt.compare(password, user.password);
        if(!isMatch){
            logger.error("User is unable to login Invalid credentials");
            return reply.status(400).send({
                message: "Unable to Login",
                error: "Invalid Credentials"
            });
            
        }
        logger.info(`User Logged in Successfully USERNAME: ${username} in ${new Date()}`);

        const authToken = user.generateAuthToken();
        const refreshToken = user.generateRefreshToken();
        logger.info(`Token Created Successfully AUTHTOKEN: ${authToken}, REFRESHTOKEN: ${refreshToken}`);

        reply.setCookie("AUTH_TOKEN", authToken, {
            path: "/",
            httpOnly: true,
            secure: true,
            sameSite: none,
            expires: new Date(Date.getSeconds() + 900)
        });

        reply.setCookie("REFRESH_TOKEN", refreshToken, {
            path: "/",
            httpOnly: true,
            secure: true,
            sameSite: none,
            expires: new Date(Date.getDate() + 1)
        });

        logger.info("login request has succeed");

        return reply.status(1005).send({
            message: "Login Successful"
        });
    } catch(err){
        logger.error("Something error occurred in login "+ err);

        return new Error("Some error occurred in login");
    }
}

async function signUp(request, reply){
    const { email, password, dob, country, firstname, lastname} = request.data;

    logger.info(`User Signup Request landed...\n ${request.data}`);

    return reply.status(200).send({
        message: "You have Registered Sucessfully"
    });
}

module.exports = {
    signIn,
    signUp
};