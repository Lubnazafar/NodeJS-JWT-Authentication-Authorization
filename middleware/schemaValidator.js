const lodash = require('lodash');
const Joi = require('joi');

// Validating ecah HTTP request against defined schema
const validateData = (schema) => { 
    return (req, res, next) => { 
    const { error } = Joi.validate(req.body, schema, {abortEarly: false}); 
    const valid = error == null; 
    if (valid) { 
      next(); 
    } else { 
      const joiError = {
           status: 'failed',
           // fetch only message from error
            details: lodash.map(error.details, ({message}) => ({
            message: message.replace(/['"]/g, '')
        }))
                                    
    };
     res.status(422).json({ error: joiError }) } 
    } 
  } 
  module.exports = validateData;
