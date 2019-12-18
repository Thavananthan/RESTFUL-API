const nodemailer=require('nodemailer');

const sentEmail=async options=>{
    //1 create transporter
    const transporter=nodemailer.createTransport({
        host:process.env.EMAIL_HOST,
        port:process.env.EMAIL_PORT,
        // service:'Gmail',
        auth:{
            user:process.env.NODEMAILERUSER,
            pass:process.env.NODEMAILERPASS
        }
    });

    //2 Define the mail options
    const mailOptions={
        from:'SLGUIDE<kani96301@gmail.com>',
        to:options.email,
        subject:options.subject,
        text:options.message
    }
    //3 Actually send the mail
   await transporter.sendMail(mailOptions)
}

module.exports=sentEmail;