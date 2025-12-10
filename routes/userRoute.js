const express = require('express')
const Router = express.Router()
const adminController = require('./../controllers/adminController')
const authController = require('../controllers/authenticateController')
const userController = require('./../controllers/userController')
Router.get('/pending', authController.protect, authController.RestrictTo('admin'), adminController.getAllPendingRequests)
Router.post('/register', authController.roleApprovelCheck, authController.registerUser)
Router.post('/login', authController.loginUser)
Router.post('/forgetpassword', authController.forgetPassword)
Router.patch('/resetpassword/:token', authController.resetPassword)

Router.put('/pending/approve/:id', authController.protect, authController.RestrictTo('admin'), adminController.approveUser)
Router.put('/pending/reject/:id', authController.protect, authController.RestrictTo('admin'), adminController.rejectedUser)

Router.route('/').get(authController.protect, authController.RestrictTo("admin"), userController.getAllUsers)
Router.route('/:id').get(authController.protect, authController.RestrictTo("admin"), userController.getUser).patch(authController.protect, authController.RestrictTo("admin"), userController.updateUser).delete(authController.protect, authController.RestrictTo("admin"), userController.deleteUser)


module.exports = Router;