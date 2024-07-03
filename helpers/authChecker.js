const jwt = require("jsonwebtoken")


const isLoggedIn = async(req , res , next)=>{
    try {
        const token = req.cookies.token;
        if(!token){
            return res.status(400).json({
                message:"Not Allowed...."
            })
        }

        const decodedToken = jwt.decode(token);
        
        next();
    } catch (err) {
        console.log(err)
        res.status(400).json({
            message:"Error in Token"
        })
    }
}

module.exports = isLoggedIn;