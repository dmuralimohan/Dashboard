/*
    Configuring firebase credentials
*/

require('dotenv').config();
const admin = require('firebase-admin');
const config = require('../config/config');
const serviceAccount = require('./keyfile.json');

const firebaseConfig = {
    apiKey: config.apiKey,
    authDomain: config.authDomain,
    projectId: config.projectId,
    storageBucket: config.storageBucket,
    messagingSenderId: config.messagingSenderId,
    appId: config.appId,
    measurementId: config.measurementId
  };

admin.initializeApp(firebaseConfig);
admin.database.enableLogging(true);
admin.firestore().settings({
    host: 'localhost:3001',
    ssl: false,
    experimentalForceLongPolling: true,
    logLevel: 'debug',
  });
const db = admin.firestore();

module.exports = {
    admin,
    db
};