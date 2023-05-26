/*
    user schemas based on the user details and token generation process
*/

const Joi = require('joi');

const userSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  dob: Joi.date().required(),
  phoneNumber: Joi.string().required(),
  authToken: Joi.string().optional(),
  refreshToken: Joi.string().optional()
}).options({ presence: 'required' });

module.exports = userSchema;