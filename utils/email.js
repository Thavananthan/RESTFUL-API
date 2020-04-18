const nodemailer=require('nodemailer');

module.exports= class Email{
    constructor(user,url){
        this.to=user.email,
        this.firstName=user.name.split(' ')[0],
        this.url=url,
        this.from=`Tour Guid<${process.env.Email_FROM}>`
    }

    createTransport(){
        if(process.env.NODE_ENV ==='production'){
            return 1;
        }
        return nodemailer.createTransport({
            host:process.env.EMAIL_HOST,
            port:process.env.EMAIL_PORT,
            // service:'Gmail',
            auth:{
                user:process.env.NODEMAILERUSER,
                pass:process.env.NODEMAILERPASS
            }
        });
    }

    //Send the actual email
    send(template,subject){
        //1) Render HTML base 
         
       
        //2 Define the mail options
        const mailOptions={
            from:'SLGUIDE<kani96301@gmail.com>',
            to:options.email,
            subject:options.subject,
            text:options.message
        }


    }
    sendWelcome(){
        this.send('welcome','Welcome to the Tour Guide')
    }


}
const sentEmail=async options=>{
    //1 create transporter
    // const transporter=nodemailer.createTransport({
    //     host:process.env.EMAIL_HOST,
    //     port:process.env.EMAIL_PORT,
    //     // service:'Gmail',
    //     auth:{
    //         user:process.env.NODEMAILERUSER,
    //         pass:process.env.NODEMAILERPASS
    //     }
    //});

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