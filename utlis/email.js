const nodemailer=require('nodemailer')

const sendEmail= async options=>{

    

    const transponder=nodemailer.createTransport({
        service:"gmail",
        secure: true, 
        auth:{
            user:process.env.EMAIL_USERNAME,
            pass:process.env.EMAIL_PASSWORD
        }
    })

   
    const mailOptions={
        from:'Aman <amanrawat464163@gmail.com>',
        to:options.email,
        subject:options.subject,
        text:options.message
    }
   
        await transponder.sendMail(mailOptions)
}

module.exports=sendEmail;
