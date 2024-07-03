const express = require('express');
const { userModel } = require('./models/User.model');
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
const crypto = require("crypto");
const connectDB = require('./config/dbConn');

const app = express();


dotenv.config();
// body parsing
app.use(express.json())
// cookie parsing
app.use(cookieParser())

// signup
app.post("/signup" , async(req , res , next)=>{
    try {
        const userData = req.body;
        if(!userData.email || !userData.password){
            return res.status(400).json({
                message:"Email and Password is Required!!"
            })
        }

        // encrypt the password
        const hashedPassword = crypto.createHmac("sha256" , process.env.ENC_SECRET).update(userData.password).digest("hex")
        const modifiedBody = {email:userData.email , password:hashedPassword};
        // create user in database
        const user = await userModel.create(modifiedBody);
        res.status(201).json({
            message:"User created....",
            data:user
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message:"Internal Server Error"
        })
    }
})

// login
app.post("/login" , async(req , res ,next)=>{
    try {
        const reqBody = req.body;

        if(!reqBody.email || !reqBody.password){
            return res.status(400).json({
                message:"Email and Password is Required!!"
            })
        }

        const user = await userModel.findOne({email:reqBody.email});

        if(!user){
            return res.status(400).json({
                message:"Invalid Credentials"
            })
        }
        // verify user password
        const bodyHash = crypto.createHmac("sha256" , process.env.ENC_SECRET).update(reqBody.password).digest("hex");
        let isVerified = false;
        if(bodyHash == user.password){
            isVerified = true;
        }

        if(isVerified){
            const token = jwt.sign({id:""} , process.env.SECRET_KEY)
            return res.status(200).cookie("token" , token).json({
                message:"Logged in successfully!!"
            })
        }

        return res.status(400).json({
            message:"Invalid Credentials"
        })

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message:"Internal Server Error"
        })
        
    }
})

app.listen(3000 , async()=>{
    await connectDB();
    console.log("Server is Started on... http://localhost:3000")
})

// function prtPrime(){
//     console.log(1);
//     for(let i=2; i < 100 ; i++){
//         let isPrime = false;
//         for(let j=2 ; j < i ; j++){
//             if(i % j == 0){
//                 isPrime = false;
//                 break;
//             }else{
//                 isPrime = true;
//             }
//         }

//         if(isPrime){
//             console.log(i);
            
//         }
//     }
// }

// prtPrime();

