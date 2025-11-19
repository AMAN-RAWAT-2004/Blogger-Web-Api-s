const mongoose=require('mongoose')
const blogSchema= new mongoose.Schema({
    title:{
        type:String,
        required:[true,'This Field is Required'],
        trim:true,
        minlength:3
    },
    slug:{
        type:String,
        unique:true,
        lowercase:true
    },
    content:{
        type:String,
        required:[true,'This Field is Required'],
        minlength:10
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    category:{
        type:String,
        required:true,
        enum:['sports','education','tech','Lifestyle', 'Travel','others'],
        default:'others'
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    image:[
        {
        type:String
    }
]
},
{
    timestamps:true,
    runValidators: true
})

blogSchema.pre('save', function(next){
    if (!this.slug) {
  this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

}
next()
})


const Blog=new mongoose.model('Blog',blogSchema)

module.exports=Blog;