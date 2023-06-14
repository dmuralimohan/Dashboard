/*
    Configuring firebase credentials
*/

require('dotenv').config();
const admin = require('firebase-admin');
const config = require('../config/config');
const serviceAccount = require('./keyfile.json');
const { logger } = require('./fastify.js');

const firebaseConfig = {
    apiKey: config.apiKey,
    authDomain: config.authDomain,
    projectId: config.projectId,
    storageBucket: config.storageBucket,
    messagingSenderId: config.messagingSenderId,
    appId: config.appId,
    measurementId: config.measurementId
  };

let auth, db;

//admin.initializeApp(firebaseConfig);
try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://dashboard-6dd90-default-rtdb.firebaseio.com"
  });
  
  auth = admin.auth();
  db = admin.firestore();
  
  logger.info("firebase is connected ");
} catch(err) {
  logger.error(err);
  throw new Error(err);
}

module.exports = {
    admin,
    auth,
    db
};