const CatchAsync= require('./../utlis/catchAsync')
const AppError= require('./../utlis/appError')
const User = require('../models/userModel')

exports.getAllPendingRequests=CatchAsync(async(req,res,next)=>{

    const pendingStatusUser= await User.find({status:"pending"})

    if(!pendingStatusUser){
       return  next(new AppError('No Pending requests are there for Approval or rejection',400))
    }

    res.status(200).json({
        status:"success",
        results:pendingStatusUser.length,
        data:{
            Users:pendingStatusUser
        }
    })
})

exports.approveUser=CatchAsync(async(req,res,next)=>{

            const Approve= await User.findByIdAndUpdate(req.params.id,{status:"approved"})

            res.status(200).json({
                status:"success",
                message:"Author Approved Succesfully"
            })
                
})
exports.rejectedUser=CatchAsync(async(req,res,next)=>{

            const Approve= await User.findByIdAndUpdate(req.params.id,{status:"rejected"})

            res.status(200).json({
                status:"success",
                message:"Author Approved Succesfully"
            })
                
})