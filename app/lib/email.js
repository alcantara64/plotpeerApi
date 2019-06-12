
 import nodemailer from 'nodemailer';

// async..await is not allowed in global scope, must use a wrapper
class EmailSender {


  emailSetup = () => {
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          type:'login',
          user: process.env.EMAIL_USER, // generated ethereal user
          pass: process.env.EMAIL_PASSWORD, // generated ethereal password
        },
        tls: {rejectUnauthorized: false}
       
      });
 }
 
 sendConfirmationMail = (name,user,token) => {
const transport = this.emailSetup()

  let mail = {
    from: process.env.EMAIL_FROM||'plotpeer@gmail.com', // sender address
    to: user, // list of receivers
    subject: "Comfirmation Email ✔", // Subject line
  html: `<p>Dear ${name}</p><b>Thank you for registering with us </b> <br/> 
  please use the link below to comfirm your email <a href="${process.env.HOST}/comfirm?token=${token}">${process.env.HOST}/comfirm?token=${token}</a>` // html body
}
transport.sendMail( mail, (err,info)=>{
if(err){
  console.error(err)
}
 console.log(info);
})
}

 resetLink = (user, name, token) => {
  const transport = this.emailSetup()
 let currentDate =  new Date();
  let mail = {
    from: process.env.EMAIL_FROM||'info@plotpeer.com', // sender address
    to: user, //;list of receivers
    subject: "Reset Password ✔", // Subject line
    text: `<p>Dear ${name}</p><h2> 
    You have requested to reset your password </h4> <br/> 
    <p>${currentDate.toLocaleDateString()}</p><br/>
    please click the button to reset your password <a href='${process.env.HOST}/resetPassword?token=${token}'>reset Password</a>`  , // plain text body
  html: `<p>Dear ${name}</p><h2> 
  You have requested to reset your password </h4> <br/> 
  <p>${currentDate.toLocaleDateString()}</p><br/>
  please click the button to reset your password <a href='${process.env.HOST}/auth/resetPassword?token=${token}'>reset Password</a>` // html body
}
transport.sendMail( mail, (err,info)=>{
if(err){
  console.error(err)
}
 console.log(info);
})
}
sendNewsLetter = (message,  subject, ...users) => {
  let mail = {
   
   from: from, // sender address
   to: users, // list of receivers
   subject: subject, // Subject line
   text: message, // plain text body
   html: message, // html body

  }

  this.transport.sendMail(mail, (err, info)=>{
    if(err) return console.error(err);
    console.log(info);
  })
}

}
export default new EmailSender();