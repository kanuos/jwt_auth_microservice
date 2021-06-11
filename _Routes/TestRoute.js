const testRoute = require("express").Router();
const {onlyPublic, onlyPrivate} =  require("../_Middlewares/authMiddleware")
const User = require("../_Models/User");


testRoute.get("/", onlyPublic, (req, res) => {
    try {
        const additionalInfo = req?.message ? req.message : null
        delete req.message;
        return res.status(200).json({
            error: null,
            data: {
                message : "Public route reached",
                additionalInfo
            }
        })
    } catch (error) {
        return res.status(200).json({
            error,
            data: null
        })
    }
})

testRoute.get("/protected", onlyPrivate, async (req, res) => {
    try {
        const user = await User.findById(req.activeUser, 'name email'); 
        return res.status(200).json({
            error: null,
            data: {
                message : "Protected route reached",
                user
            }
        })
    } catch (error) {
        return res.status(200).json({
            error,
            data: null
        })
    }
})



module.exports = testRoute;