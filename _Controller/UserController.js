const User = require("../_Models/User");
const bcrypt = require("bcryptjs");
const {RegisterValidator} = require("../_validators/UserValidator")

async function registerUser(req, res) {
    try {
        const {name, password, email} = req.body;
        const {error, value} = RegisterValidator.validate({ name, email, password })
        
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
    registerUser
}