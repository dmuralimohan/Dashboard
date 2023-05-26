/*
    Configuring users Database Scehema with credentials
*/

// const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

// const userSchema = mongoose.Schema({
//     email: {
//         type: String,
//         unique: true,
//         required: true
//     },
//     password: {
//         type: String,
//         required: true
//     }
// });

// userSchema.pre("save", async function(){
//     const user = this;
//     const hashedPassword = await bcrypt.hash(user.password, 10);
//     user.password = hashedPassword;
// });

// userScehema.method.generateAuthToken = () => {
//     const user = this;
//     const authToken = jwt.sign({
//         email: user.email
//     }, config.AUTH_KEY, {expiresIn: "15m"});

//     fastify.logger.info("Authentication token Generated Successfully AUTHTOKEN: "+ authToken);

//     return authToken;
// };

// userSchema.method.verifyAuthToken = (token) => {
//     const user = this;
//     try{
//         const decodedObj = jwt.verify(token, config.AUTH_KEY);
//         if(decodedObj.email === user.email)
//         {
//             return true;
//         }
//         return false;
//     }
//     catch(err)
//     {
//         fastify.logger.error("Error occurred in verifying Authentication Token "+ err);

//         return false;
//     }
// };

// userScehema.method.generateRefreshToken = () => {
//     const user = this;
//     const refreshToken = jwt.sign({
//         email: user.email
//     }, config.REFRESH_AUTH_KEY, {expiresIn: "1d"});

//     fastify.logger.info("Authentication token generated Successfully REFRESHTOKEN: "+ refreshToken);

//     return refreshToken;
// };

// userSchema.method.verifyRefreshToken = (token) => {
//     const user = this;
//     try{
//         const decodedObj = jwt.verify(token, config.REFRESH_AUTH_KEY);
//         if(decodedObj.email === user.email)
//         {
//             return true;
//         }
//         return false;
//     }
//     catch(err)
//     {
//         if(err.name === "TokenExpiredError")
//         {
//             fastify.logger.error("Refresh Token is Expired");
//             return reply.status(1002).send({
//                 message: "Refresh token is expired"
//             });
//         }
        
//         fastify.logger.error("Error occurrred in verifying REFRESHTOKEN "+ err);

//         return false;
//     }
// };

// const User = mongoose.model("user", userSchema);

// module.exports = User;


const { db } = require('../plugins/firebase');
const userSchema = require('../schemas/userSchema.js');

const collection = db.collection('users');

const createUser = async (userData) => {
  try {
        await validateUserSchema(userData);

    const userRef = collection.doc();
    await userRef.set(userData);

    return userRef.id;
  } catch (error) {
    return new Error("Unable to create user");
  }
};

const getUser = async (userId) => {
  const userRef = collection.doc(userId);
  const userSnapshot = await userRef.get();

  if (!userSnapshot.exists) {
    throw new Error('User not found');
  }

  return { id: userSnapshot.id, ...userSnapshot.data() };
};

const getUserByEmail = async (emailId) => {
    const querySnapshot = collection.where('email', 'email ==', emailId).get();

    if(querySnapshot.empty){
        return null;
    }

    const user = querySnapshot.docs[0].data();

    return user;
}

const updateUser = async (userId, updatedUserData) => {
    try {
        await validateUserSchema(updatedUserData);

        const userRef = collection.doc(userId);
        await userRef.update(updatedUserData);
        return true;
    } catch (error) {
        return false;
    }
};

const deleteUser = async (userId) => {
  try {
    const userRef = collection.doc(userId);
    await userRef.delete();
    return true;
  } catch (error) {
    return false;
  }
};

const validateUserSchema = async (userData) => {
  try {
    await userSchema.validateAsync(userData);
  } catch (error) {
    throw new Error('Invalid user data');
  }
};

const isUserExists = async (userId) => {
    try {
        await getUser(userId);
        return true;
    } catch (error) {
        return false;
    }
}

module.exports = { createUser, getUser, updateUser, deleteUser, getUserByEmail, isUserExists };