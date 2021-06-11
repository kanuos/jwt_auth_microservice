const jwt = require("jsonwebtoken");

const { 
    REFRESH_SECRET, 
    ACCESS_SECRET, 
    JWT_ALGORITHM, 
    REFRESH_EXPIRY, 
    ACCESS_EXPIRY 
} = process.env;

function signAccessToken(payloadData) {
    try {
        if (!payloadData.hasOwnProperty("uid")){
            throw Error("Invalid payload")
        }
        const at = jwt.sign(payloadData, ACCESS_SECRET, {
            algorithm: JWT_ALGORITHM,
            expiresIn : ACCESS_EXPIRY,  
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
            algorithm: JWT_ALGORITHM,
            expiresIn : REFRESH_EXPIRY,  
        })
        return rt;
        
    } catch (error) {
        console.log(error);
    }
}

function verifyAccessToken(token) {
    try {
        const isVerifiedToken = jwt.verify(token, ACCESS_SECRET,{
            algorithm: JWT_ALGORITHM,
            expiresIn : ACCESS_EXPIRY,
        })
        return isVerifiedToken;
    } catch (error) {
        return false;
    }
}

function verifyRefreshToken(token) {
    try {
        console.log("verifying refresh token");
        const isVerifiedToken = jwt.verify(token, REFRESH_SECRET,{
            algorithm: JWT_ALGORITHM,
            expiresIn : REFRESH_EXPIRY,
        })
        return isVerifiedToken;
    } catch (error) {
        return false;
    }
}

async function onlyPrivate(req, res, next) {    
    try {
        const cookieString = req.headers.cookie;
        // if no cookies received
        if(!cookieString) {
            throw Error("401")
        }
        const {refresh, access } = getTokensFromCookies(cookieString)
        const hasAccess = verifyAccessToken(access)
        const canRefresh = verifyRefreshToken(refresh);
        if (!hasAccess) {
            if (!canRefresh) {
                throw Error("401")
            }
            const tokens = signTokens({uid: canRefresh.uid});
            if (!tokens.access || !tokens.refresh) {
                throw Error("401")
            }
            
            res.cookie("at", tokens.access, { httpOnly: true })
            res.cookie("rt", tokens.refresh, { httpOnly: true })
            req.activeUser = canRefresh.uid
            return next()
        }
        req.activeUser = canRefresh.uid
        return next()

    } catch (error) {
        // if access token expired
        if (error.message === "401"){
            deleteTokenCookies(res)
            return res.json({
                data : null,
                error : {
                    status: true,
                    message: error.message
                }
            })
        }
    }
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
    if (!cookieString || !cookieString.includes(';')) {
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
        refresh: refresh.trim(),
        access: access.trim(),
    }
}


module.exports = {
    signTokens,
    onlyPublic,
    onlyPrivate,
    deleteTokenCookies
}