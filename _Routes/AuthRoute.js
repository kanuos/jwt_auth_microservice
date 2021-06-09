const authRouter = require("express").Router();
const {registerUser} = require("../_Controller/UserController")

/**
 * Method   : POST
 * URL      : /auth/register
 * ACCESS   : Public
 * DESC     : Registers a new user
 */

authRouter.post("/register", registerUser)



module.exports = authRouter