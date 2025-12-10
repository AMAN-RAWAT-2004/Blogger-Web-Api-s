const mongoose=require('mongoose')
const bcrypt=require('bcrypt')
const Validator=require('validator')
const crypto=require('crypto')

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'This User name Field is Required']
    },
    email:{
        type:String,
        required:[true,'This User email Field is Required'],
        unique:true,
        validator:[Validator.isEmail,'Email Format is Invalid']

    },
    password:{
        type:String,
        required:[true,'This User Password Field is Required'],
        minlength:8,
        select:false
    },
   confirmPassword:{
        type:String,
        validate:{
            validator:function(el){
                return (el===this.password)
            },
            message:'password are not same'
        }

    },
    role:{
        type:String,
        enum:['reader','admin','author'],
        default:'reader'
    },
    passwordResetToken: String,
    status:{
        type:String,
        enum:['pending','approved','rejected'],
        default:'approved'

    }
},{
    timestamps:false
})

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);
    this.confirmPassword = undefined;
    next();
});
userSchema.methods.ComparePassword=async function(currentPassword,actualUserPassword){

    return await bcrypt.compare(currentPassword,actualUserPassword)

}
userSchema.methods.generateResetToken= function(){
    const resetToken=crypto.randomBytes(32).toString('hex')
    this.passwordResetToken=crypto.createHash('sha256').update(resetToken).digest('hex')
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
}
const User=new mongoose.model('User',userSchema)

module.exports=User