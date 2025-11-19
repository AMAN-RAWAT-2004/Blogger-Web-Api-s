const express=require('express')
const Router=express.Router()
const authorController=require('./../controllers/authorController')
const authenticateController=require('./../controllers/authenticateController')

Router.route('/').get(authenticateController.protect,authenticateController.RestrictTo('reader'),authorController.getAllAuthor)

module.exports=Router;