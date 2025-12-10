const jwt = require('jsonwebtoken')
const {
    Promisify,
    promisify
} = require('util')
const CatchAsync = require('../utlis/catchAsync')
const AppError = require('../utlis/appError')
const User = require('../models/userModel')

const signToken = id => {
    return jwt.sign({
        id
    }, process.env.JWT_SECURE, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

exports.registerUser = CatchAsync(async (req, res, next) => {

    const Register = await User.create(req.body)

    const token = signToken(Register._id)
    res.status(200).json({
        status: 'success',
        message: 'User Register SuccesFully',
        token: token,
        data: {
            user: Register
        }
    })

})
exports.loginUser = CatchAsync(async (req, res, next) => {
    const {
        email,
        password
    } = req.body;
    console.log(email)
    if (!email || !password) {
        return next(new AppError('Required Fields Are Empty', 404))
    }

    const user = await User.findOne({
        email
    }).select('+password')

     

    if (!user || !(await user.ComparePassword(password, user.password))) return next(new AppError('Invalid Email or Password ', 404))

        if (user.status !== 'approved') {
        return next(new AppError('Your account is not approved yet', 403));
    }
    const token = signToken(user._id)

    res.status(200).json({
        status: 'success',
        message: 'User login Successfully',
        token: token,
        data: {
            _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status
        }
    })

})

exports.protect = CatchAsync(async (req, res, next) => {
    let Token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        Token = req.headers.authorization.split(' ')[1]
    }
    if (!Token) {
        next(new AppError('You are not Login Please login to get Access', 401))
    }
    const TokenVerify = await promisify(jwt.verify)(Token, process.env.JWT_SECURE);

    const CurrentUser = await User.findById(TokenVerify.id);

    if (!CurrentUser) return next(new AppError('This User no Longer Exists', 404))

    req.user = CurrentUser;
    next()

})

exports.RestrictTo = (...roles) => {
    return (req, res, next) => {

        if (!roles.includes(req.user.role)) {
            next(new AppError('You Donnot have Permission to Perform this action'))
        }
        next()
    }

}

exports.roleApprovelCheck = CatchAsync(async (req, res, next) => {
    const {
        role
    } = req.body;
    if (role === "reader") {
        req.body.status = "approved";
    } else if (role === "author") {
        req.body.status = "pending";
    }

    next()
})

exports.forgetPassword=CatchAsync(async(req,res,next)=>{
        const findUser=await User.findOne({email:req.body.email})
        if(!findUser){
           return next(new AppError('Cannot Find User by this email',404))
        }
        const resetToken=findUser.generateResetToken();

         await findUser.save({
        validateBeforeSave: false
    });
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetpassword/${resetToken}`
    const message = `Forgot Your Password ? Request a new Patch request with Your New Password and Password Confirm :${resetUrl}.\n if you didnot Forgot Your Password Then Ignore this Email!`

    try {

        await sendEmail({
            email: findUser.email,
            subject: 'Your Password Reset Token is Valid for 10 Minutes',
            message
        })
        res.status(200).json({
            status: "sucess",
            message: "Token Sent to Email"
        })
    } catch (err) {
        findUser.passwordResetToken = undefined;
        findUser.passwordResetExpires = undefined;
        await findUser.save({
            validateBeforeSave: false
        });

        return next(new AppError('There is an Error in sending the  email', 500))

    }




})
exports.resetPassword = CatchAsync(async (req, res, next) => {

    
    const hashToken = crypto.createHash('sha256').update(req.params.token).digest('hex')

    const user = await User.findOne({
        passwordResetToken: hashToken,
        passwordResetExpires: {
            $gt: Date.now()
        }
    })

    
    if (!user) {
        return next(new AppError('The Token is Invalid or Expired', 400))
    }
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    const token = signToken(user._id)
    user.password = undefined;
    res.status(200).json({
        status: 'sucess',
        message: 'Login Succesfully',
        token,
        data: {
            user
        }
    })

})