/*
    Configuring firebase credentials
*/

const admin = require('firebase-admin');
const config = require('../config/config');

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
const db = admin.firestore();

module.exports = {
    admin,
    db
};