const authRouter = require("express").Router();
const {
        registerUser,    
        loginUser    
} = require("../_Controller/UserController")

const { onlyPublic } = require("../_Middlewares/authMiddleware")

/**
 * Method   : POST
 * URL      : /auth/register
 * ACCESS   : Public
 * DESC     : Registers a new user
 */

authRouter.post("/register",onlyPublic, registerUser)


/**
 * Method   : POST
 * URL      : /auth/login
 * ACCESS   : Public
 * DESC     : Logs in an existing user
 */

authRouter.post("/login",onlyPublic, loginUser)


/**
 * Method   : POST
 * URL      : /auth/login
 * ACCESS   : Public
 * DESC     : Logs in an existing user
 */

authRouter.post("/logout",onlyPublic, loginUser)



module.exports = authRouter