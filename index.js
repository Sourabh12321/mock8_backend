const express = require("express");
const cors = require("cors");
const {connection} = require("./config/db")
const {userRouter} = require("./routers/userRouter")
const {postRouter} = require("./routers/postRouter")
require("dotenv").config();


const app = express();
app.use(express.json());
app.use(cors());
app.use("/user",userRouter);
app.use("/post",postRouter);



app.get("/",async(req,res)=>{
    try {
        await connection
        res.send("social Media")
    } catch (error) {
        res.send(error.message);
    }
})


app.listen(process.env.PORT,async()=>{
    try {
        console.log("working")
    } catch (error) {
        
    }
})