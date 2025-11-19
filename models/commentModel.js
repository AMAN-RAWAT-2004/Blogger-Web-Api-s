const mongoose=require('mongoose')

const commentSchema=new mongoose.Schema({
    comment:{
        type:String,
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    blog:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'blog',
        required:true
    }
},{
    timestamps:true
})

const Comments=new mongoose.model('Comment',commentSchema)

module.exports=Comments;