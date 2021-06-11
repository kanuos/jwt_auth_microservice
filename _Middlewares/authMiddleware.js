const jwt = require("jsonwebtoken");

const { REFRESH_SECRET, ACCESS_SECRET } = process.env;

function signAccessToken(payloadData) {
    try {
        if (!payloadData.hasOwnProperty("uid")){
            throw Error("Invalid payload")
        }
        const at = jwt.sign(payloadData, ACCESS_SECRET, {
            algorithm: 'HS384',
            expiresIn : '1 m',  
        })
        return at;
        
    } catch (error) {
        return null;
    }
}

function signRefreshToken(payloadData) {
    try {
        if (!payloadData.hasOwnProperty("uid")){
            throw Error("Invalid payload")
        }
        const rt = jwt.sign(payloadData, REFRESH_SECRET, {
            algorithm: 'HS384',
            expiresIn : '5 m',  
        })
        return rt;
        
    } catch (error) {
        console.log(error);
    }
}

function verifyAccessToken(token) {
    try {
        const isVerifiedToken = jwt.verify(token, ACCESS_SECRET,{
            algorithm: 'HS384',
            expiresIn : '1 m',
        })
        console.log("Access valid ",isVerifiedToken);
        return isVerifiedToken;
    } catch (error) {
        console.log("access verify error \n", error.message);
        return false;
    }
}

function verifyRefreshToken(token) {
    try {
        console.log("verifying refresh token");
        const isVerifiedToken = jwt.verify(token, REFRESH_SECRET,{
            algorithm: 'HS384',
            expiresIn : '5 m',
        })
        console.log("Refresh valid : ", isVerifiedToken);
        return isVerifiedToken;
    } catch (error) {
        console.log("refresh verify error \n", error.message);
        return false;
    }
}

async function onlyPrivate(req, res, next) {

}

function onlyPublic(req, res, next) {
    try {
        const cookieString = req.headers.cookie;
        // if no tokens sent from client
        if (!cookieString){
            return next()
        }
        const {refresh, access} = getTokensFromCookies(cookieString)
        // if token sent from client is expired
        if(verifyRefreshToken(refresh)) {
            if (verifyAccessToken(access)){
                throw Error("Access still valid. Logout to access this route.")
            }
            throw Error("Refresh still valid. Logout to access this route.")
        }
        deleteTokenCookies(res)
        req.message = 'You have been logged out!'
        return next();    
        
    } catch (error) {
        return res.status(418).json({
            error: {
                status: true,
                message: error.message
            },
            data: null
        })
    }

}

function deleteTokenCookies(res){
    res.clearCookie("at", { httpOnly: true })
    res.clearCookie("rt", { httpOnly: true })
}

function signTokens(payload) {
    return {
        access: signAccessToken(payload),
        refresh: signRefreshToken(payload),
    }
}

function getTokensFromCookies(cookieString) {
    if (!cookieString) {
        return {
            refresh: null,
            access: null
        }
    }
    const cookies = cookieString.split(';');
    let access, refresh;
    cookies.forEach(cookie => {
        if (cookie.includes("at=")){
            access = cookie.replace("at=", "");
        }
        else if (cookie.includes("rt=")){
            refresh = cookie.replace("rt=", "");
        }
    })
    return {
        refresh: refresh.trim() ?? null,
        access: access.trim() ?? null,
    }
}


module.exports = {
    signTokens,
    onlyPublic,
    onlyPrivate
}