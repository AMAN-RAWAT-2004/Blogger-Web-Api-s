const nodemailer=require('nodemailer')

const sendEmail= async options=>{

    

    const transponder=nodemailer.createTransport({
        host:process.env.EMAIL_HOST,
        port:process.env.EMAIL_PORT,
        secure: false, 
        auth:{
            user:process.env.EMAIL_USERNAME,
            pass:process.env.EMAIL_PASSWORD
        }
    })

   
    const mailOptions={
        from:'Aman <ar464163@gmail.com>',
        to:options.email,
        subject:options.subject,
        text:options.message
    }
   
        await transponder.sendMail(mailOptions)
}

module.exports=sendEmail;
