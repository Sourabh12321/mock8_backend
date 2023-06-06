const express = require("express");
const {User} = require("../models/user")
const bcrypt = require("bcrypt");
const {auth} = require("../middleware/auth")
const jwt = require("jsonwebtoken");
const userRouter = express.Router();
require("dotenv").config();


userRouter.post("/register",async(req,res)=>{
    try {
        const {name,email,password,dob,bio} = req.body;
        let user = await User.findOne({"email":email});
        if(!user){

            bcrypt.hash(password,5,async(err,hash)=>{
                if(hash){
                    let data = new User({name,email,password:hash,dob,bio});
                    await data.save();
                    res.status(201).json({"msg":"user registered successfully"})

                }
            })
        }else{
            res.status(201).json({"msg":"user is already registered"})
        }
        
    } catch (error) {
        res.status(404).json({"msg":error.message})

    }
})


userRouter.post("/login",async(req,res)=>{
    try {
        const {email,password} = req.body;
        let user = await User.findOne({"email":email});
        if(user){

            bcrypt.compare(password,user.password,async(err,decode)=>{
                if(decode){
                    let token = jwt.sign({userid:user._id},process.env.KEY,{expiresIn:"7d"});
                    res.status(201).json({"msg":"user registered successfully",token})
                }else{
                    res.status(201).json({"msg":"wrong password"})
                }
            })
        }else{
            res.status(200).json({"msg":"user is already registered"})
        }
        
    } catch (error) {
        res.status(404).json({"msg":error.message})

    }
})

userRouter.get("/users",auth,async(req,res)=>{
    try {
        let user = await User.find();
        console.log(req.user.userid);
        res.status(200).json({"msg":user})
        
    } catch (error) {
        res.status(404).json({"msg":error.message})
 
    }
})

userRouter.get("/users/:id/friends",auth,async(req,res)=>{
    try {
        let {id} = req.params;
        let user = await User.findOne({"_id":id}).populate("friends");
    
        console.log(user);
        res.status(200).json({"msg":user.friends})
        
    } catch (error) {
        res.status(404).json({"msg":error.message})
 
    }
})

userRouter.post("/users/:id/friends",auth,async(req,res)=>{
    try {
        let {id} = req.params;
        let user = await User.findOne({"_id":id});
        if(user){
            let Request = req.user.userid;
            user.friendRequests.push(Request);
            await user.save();
            res.status(201).json({"msg":"friendRequest send successfully"});

        }else{
            res.status(201).json({"msg":"user is not found"})
        }
        console.log(req.user.userid);
        
        
    } catch (error) {
        res.status(404).json({"msg":error.message})
 
    }
})


userRouter.patch("/users/:id/friends/:friendId",auth,async(req,res)=>{
    try {
        let {id,friendId} = req.params;
        let {accept} = req.body;
        let user = await User.findOne({"_id":id});
        let index = user.friendRequests.indexOf(friendId);
        if(index==-1){
            res.status(204).json({"msg":"user is not found"})
        }
        console.log(index);
        let sendUser = await User.findOne({"_id":friendId});
        if(!user || !sendUser){
            res.status(204).json({"msg":"user is not found"})
        }else{
            if(accept){
                user.friends.push(sendUser);
                sendUser.friends.push(user);
                user.friendRequests.splice(index,1);
                await user.save();
                await sendUser.save();
                res.status(204).json({"msg":"accepted the request"})

            }else{
                user.friendRequests.splice(index,1);
                await user.save();
                res.status(204).json({"msg":"rejected the request"})

            }
        }
        
        
    } catch (error) {
        res.status(404).json({"msg":error.message})
 
    }
})




module.exports = {
    userRouter
}