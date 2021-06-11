const authRouter = require("express").Router();
const {
        registerUser,    
        loginUser,    
        logoutUser
} = require("../_Controller/UserController")

const { onlyPublic, onlyPrivate } = require("../_Middlewares/authMiddleware")

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
 * URL      : /auth/logout
 * ACCESS   : Private
 * DESC     : Logs the user out. 
 */

authRouter.post("/logout", onlyPrivate, logoutUser)



module.exports = authRouter