/*
    Control all the user Routes with corresponding requests and responses
*/

const User = require('../models/user');

async function signIn(request, reply) {
    try{
        const { email, password } = request.data;
        if(!email || !password){
            reply.code(401).send("Invalid Credentials");
        }

        const user = User.findOne({ email });
        if(!user){
            reply.code(400).send("User Not Found");
        }

        const isMatch = bcrypt.compare(password, user.password);
        if(!isMatch){
            reply.status(400).send({
                message: "Unable to Login",
                error: "Invalid Credentials"
            });
            
            fastify.logger.error("User is unable to login Invalid credentials");
        }
        fastify.logger.info(`User Logged in Successfully USERNAME: ${email} in ${new Date()}`)

        const authToken = user.generateAuthToken();
        const refreshToken = user.generateRefreshToken();
        fastify.log.info(`Token Created Successfully AUTHTOKEN: ${authToken}, REFRESHTOKEN: ${refreshToken}`);

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

        reply.status(1005).send({
            message: "Login Successful"
        });
    }
    catch(err){
        fastify.log.err("Something error occurred in login "+ err);

        return new Error("Some error occurred in login");
    }
}

async function signUp(request, reply){
    const { email, password, dob, country, firstname, lastname} = request.data;
}

exports.modules = signIn;