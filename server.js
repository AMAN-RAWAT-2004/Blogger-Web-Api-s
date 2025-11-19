const express=require('express')
const mongoose=require('mongoose')
const App=require('./app')
const dotenv=require('dotenv')

dotenv.config({
    path:'./config.env'
})

const DB=process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD)
mongoose.connect(DB,{
        useNewUrlParser:true
}).then(()=>{
        console.log('Database is Connected Succesfully')
}).catch((err)=>{
    console.log(err)
})



Port=process.env.PORT || 3000;
App.listen(Port,()=>{
    console.log(`Server is listning to the ${Port}`)
})
