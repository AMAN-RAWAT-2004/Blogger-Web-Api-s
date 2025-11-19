const CatchAsync = require('./../utlis/catchAsync')
const AppError = require('./../utlis/appError')
const Comments = require('./../models/commentModel')
const catchAsync = require('./../utlis/catchAsync')


exports.CreateComment = CatchAsync(async (req, res, next) => {

    const Comment = await Comments.create({
        comment: req.body.comment,
        user: req.user.id,
        blog: req.params.id

    })
    if (!Comment) {
        return next(new AppError('There is somthing missing', 404))
    }

    res.status(200).json({
        status: 'Success',
        message: 'Comment Succesfully Created',
        data: {
            Comment
        }
    })
})

exports.getAllComments = CatchAsync(async (req, res, next) => {
    const readComments = await Comments.find().populate({
        path: 'user ',
        select: 'name _id'
    })
    res.status(200).json({
        status: 'Success',
        results: readComments.length,
        data: {
            readComments
        }
    })
})
exports.updateComment = CatchAsync(async (req, res, next) => {
    const updateCmnt = await Comments.findByIdAndUpdate(req.params.id, {comment:req.body.comment})
    if (!updateCmnt) {
        return next(new AppError('There is not Such comment with that User id', 404))
    }
    res.status(200).json({
        status: 'Success',
        message: 'Comment Updated Succesfully'
    })
})
exports.deleteComment = catchAsync(async (req, res, next) => {
    const deleteComment = await Comments.findByIdAndDelete(req.params.id)
    if (!deleteComment) {
        return next(new AppError('There is not Such comment with that User id', 404))
    }
    res.status(200).json({
        status: 'Success',
        message: 'Comment Deleted Succesfully'
    })
})