const joi = require("joi")


// schema to validate the incoming request body to create new user
const userRegisterSchema = joi.object({
        name    : joi
                .string()
                .pattern(/^[a-zA-Z ]*$/)
                .required()
                .trim()
                .min(2)
                .max(50)
                .messages({
                    "string.empty": "Name cannot be empty or blank spaces",
                    "any.required": "Name is required",
                    "string.pattern.base": "Name can only contain letter from the English alphabet",
                    "string.min": "Name must be at least 2 characters long",
                    "string.max": "Name must be at most 50 characters long"
                }),
        
        email   : joi
                .string()
                .required()
                .trim()
                .email()
                .messages({
                        "string.empty": "Email cannot be empty or blank spaces",
                        "any.required": "Email is required",
                        "string.email": "Email is invalid"
                    }),

        password : joi
                 .string()
                 .required()
                 .min(6)
                 .max(20)
                 .messages({
                        "string.empty": "Password cannot be empty or blank spaces",
                        "any.required": "Password is required",
                        "string.min": "Password must be at least 2 characters long",
                        "string.max": "Password must be at most 20 characters long"
                    }),

})


// schema to validate the incoming request body to login existing user
const userLoginSchema = joi.object({
        email   : joi
                .string()
                .required()
                .trim()
                .email()
                .messages({
                        "string.empty": "Email cannot be empty or blank spaces",
                        "any.required": "Email is required",
                        "string.email": "Email is invalid"
                    }),

        password : joi
                 .string()
                 .required()
                 .min(6)
                 .max(20)
                 .messages({
                        "string.empty": "Password cannot be empty or blank spaces",
                        "any.required": "Password is required",
                        "string.min": "Password must be at least 2 characters long",
                        "string.max": "Password must be at most 20 characters long"
                    }),

})


module.exports = {
    RegisterValidator : userRegisterSchema,
    LoginValidator : userLoginSchema
}