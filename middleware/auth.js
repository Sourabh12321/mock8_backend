const jwt = require("jsonwebtoken")
require("dotenv").config();
const auth = async(req,res,next) =>{
    let token = req.headers.authorization.split(" ")[1];
        console.log(token);
    try {
        
        if(token){
            jwt.verify(token,process.env.KEY,(err,verify)=>{
                if(verify){
                    req.user = verify;
                    
                    next();
                }else{
                    res.send("wrong password")
                }
            })
        }
    } catch (error) {
        res.send("wrong password")
        
    }
    
    
}

module.exports = {
    auth
}