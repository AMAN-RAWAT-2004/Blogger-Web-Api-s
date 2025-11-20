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