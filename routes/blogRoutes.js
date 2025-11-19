const express = require('express')
const Router = express.Router()

const commentController = require('./../controllers/commentController') 
const authController = require('../controllers/authenticateController')

const blogController = require('./../controllers/blogController')
Router.post('/createblogs', authController.protect, authController.RestrictTo('author'), blogController.createBlogs)
Router.route('/').get(blogController.getAllblogs)
Router.route('/:id').delete( authController.protect, authController.RestrictTo('author','admin'),blogController.deleteBlogs).get(authController.protect, authController.RestrictTo('reader'),blogController.getBlogsByAuthourID).patch(authController.protect,authController.RestrictTo('author'),blogController.updateBlogs)




module.exports = Router;