/*
    Configuring users Cloud Firebase and Generating Token
*/

// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const config = require('../config/config');

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

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { auth, db } = require('../plugins/firebase');
const userSchema = require('../schemas/userSchema.js');
const { logger } = require('../plugins/fastify');
const config = require('../config/config');

/*
  Interacting Cloud firestore from firebase
*/

const collection = db.collection("users");

const createUser = async (userData) => {
  try {
    const emailId = userData.email;
    const isExists = await isUserExistsByEmailId(emailId);

    if(isExists) {
      return {error: "User has Already Exists"};
    }

    validateUserSchema(userData);
    userData.password = await bcrypt.hash(userData.password, 10);
    logger.info("Registered user data is:"+JSON.stringify(userData))
    const userRef = collection.doc();
    await userRef.set(userData);
  
    logger.info("User has registered successfully " + userRef.id);

    return userRef;
  } catch (error) {
    return {error: "Something went wrong from createUser"};
  }
};

const getAllUsers = async () => {
  try {
    const userList = await auth.listUsers();
    const users = userList.users.map((userRecord) => userRecord.toJson());

    return users;
  } catch (err) {
    logger.error("Error from getAllUsers "+ err);
    throw new Error(err);
  }
}

const getUser = async (userId) => {
  const userRef = collection.doc(userId);
  const userSnapshot = await userRef.get();

  if (!userSnapshot.exists) {
    throw new Error('User not found');
  }

  return { id: userSnapshot.id, ...userSnapshot.data() };
};

const getUserByEmail = async (emailId) => {
    logger.info("Getting email to get User Details... EmailId is: "+ emailId);

    try {

      /*
        Alternative approach
        const userRecord = await auth.getUserByEmail(emailId);
      */
      const querySnapshot = await collection.where('email', '==', emailId).get();
      logger.info("user data: "+ querySnapshot.docs);

      if(querySnapshot.docs && querySnapshot.docs[0]){
        const userData = await querySnapshot.docs[0].data();
        logger.info("Data is fetched from email id: "+ userData);
        logger.info("The data is: "+ JSON.stringify(querySnapshot.docs[0].data()));
        return userData;
      }

      logger.info("User not Found : "+ emailId);
      
      return null;
    } catch (error) {
      logger.trace("Somethign error occured in Fetching Data from Email id "+ error);
      throw new Error(error);
    }
}

const getUserIdByEmailId = async (emailId) => {
    try {
      logger.info("Getting email to get User Details from getUserByEmailIdAdmin... EmailId is: "+ emailId);

      const userRecord = await auth.getUserByEmail(emailId);
      const userId = userRecord && userRecord.uid ? userRecord.uid : null;

      logger.info("Getting userRecord from [getUserIdEmailId] "+ userRecord +"UserId: "+ userId);

      return userId;
    } catch (err) {
      if(err.code.indexOf("user-not-found")) {
        return false;
      } else {
        logger.error("Something error occured in getUserIdByEmailId");
        throw new Error(err);
      }
    }
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

const deleteUserById = async (userId) => {
  try {
    const userRef = collection.doc(userId);
    await userRef.delete();
    return true;
  } catch (error) {
    return false;
  }
};

const deleteUserByEmail = async (emailId) => {
  try {
    const querySnapshot = await collection.where('email', '==', emailId).get();

    if(querySnapshot.docs && querySnapshot.docs[0]){
      const userRef = querySnapshot.docs[0].ref();
      await userRef.delete();
      logger.info("Data is deleted from email id: "+ user);
      return true;
    }
    return new Error("User not Found");
  } catch (err) {
    logger.error("Some error occured in delete user data using email id "+ err+" ");
    return new Error("Some thing error occured in delete email "+ err);
  }
}

const validateUserSchema = async (userData) => {
  try {
    await userSchema.validateAsync(userData);
  } catch (err) {
    throw new Error('Invalid user data '+ err);
  }
};

const isUserExistsByUId = async (userId) => {
    try {
        await this.getUser(userId);
        return true;
    } catch (err) {
        return false;
    }
}

const isUserExistsByEmailId = async (emailId) => {
  try {
     const uid  = await getUserByEmail(emailId);
     logger.info(`Existing checking this email id: ${emailId} : ${uid}`);

     if( uid && uid.email) {
      return true;
     }
     return false;
  } catch (err) {
      logger.error(err);
      throw new Error(err);
  }
}

/*
  Generating Authentication Token and Refreshtoken
*/

const generateAuthTokenByFirebase = async (data) => {
  try {
    const authToken = await auth.createCustomToken(data);
    return authToken;
  } catch (err) {
    logger.trace("Error generating token from firebase "+ err);
    return null;
  }
}

const generateAuthToken = async (emailId) => {
  try {
    const uid = await getUserIdByEmailId(emailId);
    const userData = {uid: uid};
    const authToken = await jwt.sign(userData, config.AUTH_KEY, {expiresIn: "15m"});
    logger.info("Authentication token Generated Successfully AUTHTOKEN: "+ authToken);

    return authToken;
  } catch (err) {
    logger.error("Something error occured in Generating Authentication Token "+ err);
    return null;
  }
}

const generateRefreshToken = async (userData) => {
  try {
    const authToken = await jwt.sign(userData, config.REFRESH_AUTH_KEY, {expiresIn: "1d"});
    logger.info("Refresh token Generated Successfully REFRESHTOKEN: "+ authToken);

    return authToken;
  } catch (err) {
    logger.error("Something Error occurred in Generating RefreshToken "+ err);
    return null;
  }
}

module.exports = { createUser, getUser, updateUser, deleteUserById, deleteUserByEmail,  getUserByEmail, getUserIdByEmailId, isUserExistsByUId, isUserExistsByEmailId, generateAuthToken, generateRefreshToken };