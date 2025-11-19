const CatchAsync=require('./../utlis/catchAsync')
const AppError = require('./../utlis/appError')
const User=require('./../models/userModel')

exports.getAllUsers=CatchAsync(async (req,res,next)=>{

    const users= await User.find({status:'approved'})

    res.status(200).json({
        status:'success',
        results:users.length,
        data:{
            users
        }
    })

})
exports.getUser=CatchAsync(async (req,res,next)=>{

    const user= await User.findById(req.params.id)
    if(!user){
        return next(new AppError('There No such User Exists with That id',404))
    }

    res.status(200).json({
        status:'success',
        data:{
            user
        }
    })

})
exports.updateUser=CatchAsync(async (req,res,next)=>{

    const updateUser= await User.findByIdAndUpdate(req.params.id,req.body)
    
    res.status(200).json({
        status:'success',
        message:` The ${updateUser.name} User updated Successfully`
    })

})
exports.deleteUser=CatchAsync(async (req,res,next)=>{

    const deleteUser= await User.findByIdAndDelete(req.params.id)

    res.status(200).json({
        status:'success',
        message:` The ${deleteUser.name} User Deleted Successfully`
    })

})