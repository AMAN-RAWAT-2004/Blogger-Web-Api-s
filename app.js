const express=require('express')
const globalErrorHandler=require('./utlis/globalErrorHandler')
const AppError=require('./utlis/appError')
const userRoutes=require('./routes/userRoute')
const blogRoutes=require('./routes/blogRoutes')
const AuthorRoutes=require('./routes/authorRoute')
const commentRoute=require('./routes/commentRoute')
const Morgan=require('morgan')
const App=express()
App.use(
    Morgan('dev')
)
App.use(express.json())

App.use('/api/v1/users',userRoutes)
App.use('/api/v1/blogs',blogRoutes)
App.use('/api/v1/authors',AuthorRoutes)
App.use('/api/v1/comments',commentRoute)

App.all('*',(req,res,next)=>{

    next(new AppError(`Can't Found ${req.originalUrl} on this route`,404) )

})
App.use(globalErrorHandler)
module.exports=App;