/*
    Control all the user Routes with corresponding requests and responses
*/

const bcrypt = require('bcrypt');


const UserModel = require('../models/user');
const logger = require('../plugins/fastify').logger;
const Utils = require('../utils');

async function signIn(request, reply) {
    try{
        logger.info(`Data is received: ${JSON.stringify(request.body.data)}`);
        const { username, password } = request.body.data;
        logger.info(`User has sign in request ${username} ${password}`);

        if(!username || !password){
            return reply.code(401).send("Invalid Credentials");
        }

        const user = await UserModel.getUserByEmail(username);

        if(!user || !user.email){
            logger.info(`User not found Email id: ${username}`);
            return reply.code(404).send({error: "User Not Found"});
        }
        logger.info("Logged User:"+ JSON.stringify(user));

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            logger.trace("User is unable to login Invalid credentials ");
            return reply.status(400).send({
                message: "Unable to Login",
                error: "Invalid Credentials"
            });
            
        }
        console.log(user);

        const authToken = await UserModel.generateAuthToken(user.email);
        const refreshToken = await UserModel.generateRefreshToken({email: user.email});
        logger.info(`Token Created Successfully AUTHTOKEN: ${authToken}, REFRESHTOKEN: ${refreshToken}`);

        const authCookie = Utils.createCookie({data:`AUTH_TOKEN=${authToken}`});
        const refreshCookie = Utils.createCookie({expires: new Date(new Date().getDate() + 1),data: `REFRESH_TOKEN=${refreshToken}`});

        reply.header("Set-Cookie", [authCookie, refreshCookie]);

        logger.info(`User Logged in Successfully USERNAME: ${username} in ${new Date()}`);

        reply.status(200).send({
            message: "Login Successful and Cookie setting from the header"
        });
        
    } catch(err){
        logger.error(`Something error occurred in login "+ ${err}`);

        return new Error("Some error occurred in login");
    }
}

async function signUp(request, reply){
    const { email, password, dob, country, firstname, lastname} = request.body.data;

    logger.info(`User Signup Request landed...\n ${JSON.stringify(request.body.data)}`);

    if(!email || !password || !dob || !country || !firstname || !lastname)
    {
        logger.trace("Some data are missed, please give requested Data");
        return reply.status(422).send({
            message: "The data is insufficient"
        });
    }

    const user = await UserModel.createUser(request.body.data);

    if(user.id)
    {
        return reply.status(200).send({
            message: "You have Registered Sucessfully",
            userId: user.id
        });
    } else {
        return reply.status(400).send({
            message: "Unauthorized response"
        })
    }
}

module.exports = {
    signIn,
    signUp
};