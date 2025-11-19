const express = require('express')
const Router = express.Router()
const commentController = require('./../controllers/commentController')
const authController = require('../controllers/authenticateController')
Router.post('/writecomment/:id',authController.protect,authController.RestrictTo('reader'),commentController.CreateComment)
Router.route('/:id').delete(authController.protect,authController.RestrictTo('reader','admin'),commentController.deleteComment).patch(authController.protect,authController.RestrictTo('reader'),commentController.updateComment)
Router.route('/').get(commentController.getAllComments)

module.exports = Router;