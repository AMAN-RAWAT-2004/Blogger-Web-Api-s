const CatchAsync=require('./../utlis/catchAsync')
const AppError=require('./../utlis/appError')
const User=require('./../models/userModel')
const Blog=require('./../models/blogModel')

exports.createBlogs=CatchAsync(async(req,res,next)=>{
     const newBlog = new Blog({
      ...req.body,           
      author: req.user._id   
    });

    
    await newBlog.save();

    res.status(200).json({
        status:"success",
        message:"The Blog Successfully Created",
        data:{
            newBlog
        }
    })
})
exports.getAllblogs=CatchAsync(async (req,res,next)=>{
    const queryFilter={...req.query}
    const excludedFields=['page','sort','limit','fields'];
    excludedFields.forEach(el=> delete queryFilter[el]);

    const blogs= await Blog.find(queryFilter).populate({path:'author',
        select:'name _id'
    })

    res.status(200).json({
        status:'success',
        results:blogs.length,
        data:{
            blogs
        }
    })

})
exports.getBlogsByAuthourID=CatchAsync(async(req,res,next)=>{
    const id=req.params.id
   
    const FindBlogs=await Blog.find({author:id})

    if(FindBlogs.length===0){
        return next(new AppError('There no Such Blog  with That author',404))
    }
    res.status(200).json({
        status:'success',
        results:FindBlogs.length,
        data:{
            Blogs:FindBlogs
        }
    })
})
exports.updateBlogs=CatchAsync(async(req,res,next)=>{
    const UpdateBlogs=await Blog.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
         runValidators: true
    })

    if(!UpdateBlogs){
        return next(new AppError('There no Such Blog  with That Id',404))
    }

    res.status(200).json({
        status:'success',
        message:'Blog updated Succesfully',
        data:{
            UpdateBlogs
        }
    })

})

exports.deleteBlogs=CatchAsync(async(req,res,next)=>{

    const deleteBlog= await Blog.findByIdAndDelete(req.params.id)
    if(!deleteBlog){
        return next(new AppError('There no Such Blog  with That Id',404))
    }
     res.status(200).json({
        status:'success',
        message:'Blog Deleted Succesfully'
    })
})

exports.SearchBar=CatchAsync(async(req,res,next)=>{
    const Search=req.query.q||"";
    const Blogs=await Blog.find({
      title: { $regex: Search, $options: "i" }
    })
    if(!Blogs){
        return next(new AppError('There is no Such Blog with that name',404))
    }
    res.json({
      success: true,
      count: Blogs.length,
      Blogs
    });
})
