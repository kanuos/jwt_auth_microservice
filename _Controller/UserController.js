const User = require("../_Models/User");
const bcrypt = require("bcryptjs");
const {RegisterValidator, LoginValidator} = require("../_validators/UserValidator");
const {
        onlyPublic, 
        signTokens,
    
    } = require("../_Middlewares/authMiddleware");

async function registerUser(req, res) {
    try {
        const {error, value} = RegisterValidator.validate(req.body)
        
        // validation error if any
        if (error) {
            throw Error(error.details[0].message)
        }

        // check if user exists with same email
        const availableEmail = await checkEmailAvailability(value.email);
        
        if (!availableEmail){
            throw Error("Email already exists. Try a different email address.")
        }

        // hash the password
        const hashedPassword = await bcrypt.hash(value.password, 10);
        
        // insert user with hashed password to db
        const newUser = User({
            name : value.name,
            email : value.email,
            password : hashedPassword,
        })

        await newUser.save();

        return res.status(201).json({
            data : {uid: newUser._id, name: newUser.name, email: newUser.email },
            error: null
        })

    } catch (error) {
        return res.status(400).json({
            data : null,
            error: {
                status : true,
                message : error.message
            }
        })
    }
}

async function loginUser(req, res) {
    try {
        const {error, value} = LoginValidator.validate(req.body)
        
        // validation error if any
        if (error) {
            throw Error(error.details[0].message)
        }

        // look up database for user with said email ID
        const existingUser = await User.findOne({email : value.email})
        
        if (!existingUser){
            req.errorStatus = 404
            throw Error(`Account with email ID "${value.email}" does not exist`)
        }

        // compare the hashed password with the input password
        const isMatched = await bcrypt.compare(value.password, existingUser.password);
        
        if (!isMatched) {
            req.errorStatus = 400
            throw Error("Invalid login credentials")
        }
        // issue tokens 
        const {access, refresh} = await signTokens({uid: existingUser._id})

        res.cookie("at", access, { httpOnly: true })
        res.cookie("rt", refresh, { httpOnly: true })

        return res.status(201).json({
            data : {uid: existingUser._id, name: existingUser.name, email: existingUser.email },
            error: null
        })
        
    } catch (error) {
        return res.status(400).json({
            data : null,
            error: {
                status : true,
                message : error.message
            }
        })
    }
}

async function checkEmailAvailability(email) {
    try {
        const existingUser = await User.findOne({email});
        console.log(existingUser);
        if (!existingUser){
            return true;
        }
        return false;
    } catch (error) {
        console.log(error);
    }
}



module.exports = {
    registerUser, loginUser, checkEmailAvailability
}