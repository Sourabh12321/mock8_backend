const express = require("express");
const {auth} = require("../middleware/auth")
const {Post} = require("../models/post")
const postRouter = express.Router();


postRouter.post("/posts",auth,async(req,res)=>{
    try {
        let id = req.user.userid
        let {text,image} = req.body;
        let obj = {
            user:id,
            text:text,
            image:image
        }
        console.log(obj);
        let data = new Post(obj);
        await data.save();
    
        res.status(201).json({"msg":"post created successfully"});
        
    } catch (error) {
        res.status(404).json({"msg":error.message})
 
    }
})

postRouter.patch("/posts/:id",auth,async(req,res)=>{
    try {
        let {id} = req.params;

        let data = await Post.findByIdAndUpdate({"_id":id},req.body);
    
        res.status(204).json({"msg":"post updated successfully"});
        
    } catch (error) {
        res.status(404).json({"msg":error.message})
 
    }
})

postRouter.delete("/posts/:id",auth,async(req,res)=>{
    try {
        let {id} = req.params;
        
        let data = await Post.findByIdAndDelete({"_id":id});
    
        res.status(202).json({"msg":"post deleted successfully"});
        
    } catch (error) {
        res.status(404).json({"msg":error.message})
 
    }
})

postRouter.post("/posts/:id/like",auth,async(req,res)=>{
    try {
        let {id} = req.params;
        let post = await Post.findOne({"_id":id});
        console.log(post);
        if(post){
            let like = req.user.userid;
            post.likes.push(like);
            await post.save();
            res.status(201).json({"msg":"post liked successfully"});

        }else{
            res.status(201).json({"msg":"post is not found"})
        }
        
        
    } catch (error) {
        res.status(404).json({"msg":error.message})
 
    }
})

postRouter.post("/posts/:id/comment",auth,async(req,res)=>{
    try {
        let {id} = req.params;
        let post = await Post.findOne({"_id":id});
        console.log(post);
        if(post){
            let comment = req.user.userid;
            post.comments.push(comment);
            await post.save();
            res.status(201).json({"msg":"post commented successfully"});

        }else{
            res.status(201).json({"msg":"post is not found"})
        }
        
        
    } catch (error) {
        res.status(404).json({"msg":error.message})
 
    }
})

postRouter.get("/posts/:id",auth,async(req,res)=>{
    try {
        let {id} = req.params;
        let post = await Post.findOne({"_id":id}).populate("likes","comments");
        console.log(post);
        if(post){
            res.status(200).json({"msg":post});

        }else{
            res.status(200).json({"msg":"post is not found"})
        }
        
        
    } catch (error) {
        res.status(404).json({"msg":error.message})
 
    }
})

postRouter.get("/posts",auth,async(req,res)=>{
    try {
        
        let post = await Post.find().populate("likes","comments");
        if(post){
            res.status(200).json({"msg":post});

        }else{
            res.status(200).json({"msg":"post is not found"})
        }
        
        
    } catch (error) {
        res.status(404).json({"msg":error.message})
 
    }
})

module.exports = {
    postRouter
}