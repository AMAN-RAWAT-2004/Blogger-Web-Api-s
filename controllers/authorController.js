const CatchAsync=require('./../utlis/catchAsync')
const AppError = require('./../utlis/appError')
const User=require('./../models/userModel')

exports.getAllAuthor=CatchAsync(async(req,res,next)=>{
    const author=await User.find({role:'author',status:'approved'}).select('name _id email')
    if(!author){
        return next(new AppError('There is no Any Author ',404))
    }
    res.status(200).json({
        status:'Success',
        data:{
            Authors:author
        }
    })
})

exports.getAuthour=CatchAsync(async(req,res,next)=>{
    const getAuthor= await User.findById(req.params.id,{role:'author',status:'approved'}).select('name _id email')
     if(!getAuthor){
        return next(new AppError('There is no Any Author ',404))
    }
    res.status(200).json({
        status:'Success',
        data:{
            Author:getAuthor
        }
    })
})