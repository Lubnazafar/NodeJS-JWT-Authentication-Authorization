// 5ZYUZFHK4
const joi = require('joi');

//Joi schema for signup API
const schema = {
 signupSchema : joi.object().keys({
    name: joi.string().alphanum().min(2).max(30).required(),
    password: joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
    email: joi.string().email().required(),
    role: joi.string().min(2).max(30)
}),
//Joi schema for login API
 loginSchema : joi.object().keys({
    password: joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
    email: joi.string().email().required()
})
}
module.exports = schema;
