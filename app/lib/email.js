/* eslint-disable no-console */

import nodemailer from 'nodemailer';

// async..await is not allowed in global scope, must use a wrapper
class EmailSender {
  emailSetup = () => {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        type: 'login',
        user: process.env.EMAIL_USER, // generated ethereal user
        pass: process.env.EMAIL_PASSWORD, // generated ethereal password
      },
      tls: { rejectUnauthorized: false },
    });
  };

  sendConfirmationMail = (name, user, token) => {
    const transport = this.emailSetup();

    let mail = {
      from: process.env.EMAIL_FROM || 'plotpeer@gmail.com', // sender address
      to: user, // list of receivers
      subject: 'Comfirmation Email ✔', // Subject line
      html: `<html>

      <head>
        <title>Plotpeer - Confirm your account!</title>
        <style>
          @font-face {
                  font-family: 'Avenir';
                  src: url('https://www.letsgohatch.com/assets/fonts/avenirltstd-heavy-webfont.eot');
                  src: url('https://www.letsgohatch.com/assets/fonts/avenirltstd-heavy-webfont.eot?#iefix') format('embedded-opentype'),
                       url('https://www.letsgohatch.com/assets/fonts/avenirltstd-heavy-webfont.woff2') format('woff2'),
                       url('https://www.letsgohatch.com/assets/fonts/avenirltstd-heavy-webfont.woff') format('woff'),
                       url('https://www.letsgohatch.com/assets/fonts/avenirltstd-heavy-webfont.ttf') format('truetype'),
                       url('https://www.letsgohatch.com/assets/fonts/avenirltstd-heavy-webfont.svg#webfontregular') format('svg');
                  font-weight: bold;
                  font-style: normal;
              }
            
              @font-face {
                  font-family: 'Avenir';
                  src: url('https://www.letsgohatch.com/assets/fonts/avenirltstd-medium-webfont.eot');
                  src: url('https://www.letsgohatch.com/assets/fonts/avenirltstd-medium-webfont.eot?#iefix') format('embedded-opentype'),
                      url('https://www.letsgohatch.com/assets/fonts/avenirltstd-medium-webfont.woff2') format('woff2'),
                        url('https://www.letsgohatch.com/assets/fonts/avenirltstd-medium-webfont.woff') format('woff'),
                       url('https://www.letsgohatch.com/assets/fonts/avenirltstd-medium-webfont.ttf') format('truetype'),
                      url('https://www.letsgohatch.com/assets/fonts/avenirltstd-medium-webfont.svg#webfontregular') format('svg');
                  font-weight: normal;
                  font-style: normal;
            
              }
            
              @font-face {
                 font-family: 'Avenir';
                  src: url('https://www.letsgohatch.com/assets/fonts/avenirltstd-light-webfont.eot');
                  src: url('https://www.letsgohatch.com/assets/fonts/avenirltstd-light-webfont.eot?#iefix') format('embedded-opentype'),
                       url('https://www.letsgohatch.com/assets/fonts/avenirltstd-light-webfont.woff2') format('woff2'),
                       url('https://www.letsgohatch.com/assets/fonts/avenirltstd-light-webfont.woff') format('woff'),
                       url('https://www.letsgohatch.com/assets/fonts/avenirltstd-light-webfont.ttf') format('truetype'),
                       url('https://www.letsgohatch.com/fonts/avenirltstd-light-webfont.svg#webfontregular') format('svg');
                  font-weight: 100;
                  font-style: normal;
              }
              body{
                background: #ffffff;
                margin: 0px;
                text-align: center;
                font-family: 'Avenir', 'Open Sans', Arial, sans-serif;
              }
              .head{
                background: #488dfb;
                color: #ffffff;
              }
            
              .head h1{
                font-size: 50px;
                font-weight: normal;
                line-height: 100px;
                margin-top: 100px;
              }
            
              .button{
                background: #39ce00;
                color: #ffffff;
                line-height: 50px;
                text-decoration: none;
                text-align: center;
                margin-top: 50px;
                margin-bottom: 50px;
              }
            
              .button a{
                color: #ffffff;
                text-decoration: none;
              }
              a{ color: #fff; } 
              p a{ color: #565656; } 
              .black a{ color: #000; }
        </style>
        <link href='https://fonts.googleapis.com/css?family=Open+Sans' rel='stylesheet' type='text/css'>
      </head>
      
      <body bgcolor="#ffffff">
        <table bgcolor="#efefef" cellpadding="0" cellspacing="0" border-collapse="collapse" width="100%">
          <tr>
            <td align="center" style="padding: 30px;">
              <table bgcolor="#efefef" cellpadding="0" cellspacing="0" border-collapse="collapse" width="700px">
                <tr>
                  <td align="center">
                    <table bgcolor="#efefef" cellpadding="0" cellspacing="0" border-collapse="collapse" width="100%">
      
                          <!--<a href="#" style="color: #868686;">View in Browser</a>-->
                        </td>
                      </tr>
                    </table>
                    <img src="https://plotpeer.herokuapp.com/static/media/logo.9f517a87.png" alt="Hatch" border="0" height="50" style="margin-top: 50px; margin-bottom: 50px;" />
                    <table bgcolor="#100B08" class="head" style="background: #488dfb;" cellpadding="0" cellspacing="0" border="0" border-collapse="collapse" width="100%">
                      <tr>
                        <td style="text-align: center;" colspan="3">
                          <h1>Welcome to PlotPeer</h1>
      
                        </td>
                      </tr>
                      <tr>
                        <td colspan="3" style="padding: 0px 80px; font-size: 20px; text-align: center;">Hi ${name}, Welcome to Plotpeer, please confirm your email address to get started.</td>
                      </tr>
                      <tr>
                        <td width="30%">&nbsp;</td>
                        <td style="text-align: center;" width="40%">
                          <table cellpadding="0" cellspacing="0" border-collapse="collapse" class="button" width="100%">
                            <tr>
                              <td>
                                <a href="${process.env.HOST}/verify/${token}" target="_blank" style="font-size: 15px;">Confirm my email</a>
                              </td>
                            </tr>
                          </table>
                        </td>
                        <td width="30%">&nbsp;</td>
                      </tr>
                      <tr>
                        <td>&nbsp;</td>
                      </tr>
                      <tr>
                        <td>&nbsp;</td>
                      </tr>
                      <tr>
                        <td>&nbsp;</td>
                      </tr>
                    </table>
                    <table cellpadding="0" cellspacing="0" border="0" border-collapse="collapse" width="100%">
                      <tr>
                        <td>&nbsp;</td>
                      </tr>
                      <tr>
                        <td>&nbsp;</td>
                      </tr>
                    </table>
                    <table bgcolor="#ffffff" class="head" style="background: #ffffff;" cellpadding="0" cellspacing="0" border="0" border-collapse="collapse" width="100%">
                      <tr>
                        <td style="text-align: center;" colspan="3">
                          <h1 style="color: #000000">Questions?</h1>
      
                        </td>
                      </tr>
                      <tr>
                        <td colspan="3" style="padding: 0px 80px; font-size: 20px; text-align: center; color: #595f63;  font-size: 20px;">If you have any questions about Hatch please don’t hesitate to get in touch.</td>
                      </tr>
                      <tr>
                        <td style="padding: 40px;" align="center">
                          <a href="mailto:support@plotpeer.com" style="color: #488dfb; text-decoration: none; margin-bottom: 40px; font-size: 20px;">support@plotpeer.com</a>
                        </td>
                      </tr>
                      <tr>
                        <td>&nbsp;</td>
                      </tr>
                      <tr>
                        <td>&nbsp;</td>
                      </tr>
                      <tr>
                        <td>&nbsp;</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
            <td>&nbsp;</td>
          </tr>
          <tr>
            <td>&nbsp;</td>
          </tr>
        </table>
        
        <img src="http://trk.letsgohatch.com/wf/open?upn=eLFMrKDT8iBxZ-2Fbnk-2BZqvRm7gLQf0EF1gz9NAjgHD5WTiYuNE2jIsCyRP5I2tmF8hG4i8aFN1Oiun3zqRadDjYrzpuNEE0XiWvv6k-2Bu277ViJ8AK4LPswxiERLb4phDt3PEtozhOwmLJRyFmiPk9H9qw5S36JLwDluRG0ownUItTdCK61tgLQejMUlTgYNQ2k-2FKgkbAG7Q3L5KqqHqBGRqUxqdo0nj2vSQ7hZr-2BJL74-3D"
          alt="" width="1" height="1" border="0" style="height:1px !important;width:1px !important;border-width:0 !important;margin-top:0 !important;margin-bottom:0 !important;margin-right:0 !important;margin-left:0 !important;padding-top:0 !important;padding-bottom:0 !important;padding-right:0 !important;padding-left:0 !important;"
        />
      </body>
      
      </html>`, // html body
    };
    transport.sendMail(mail, (err, info) => {
      if (err) {
        console.error(err);
      }
      console.log(info);
    });
  };

  messaging = (from='info@plotpeer.com', to, subject='', message) =>{
    const transport = this.emailSetup();

let mail = {
   from: from,
   to: to,
   subject: subject,
   html: message,
};
transport.sendMail(mail, (err, info) => {
  if (err) {
    console.error(err);
  }
  console.log(info);
});
  }

  resetLink = (user, name, token) => {
    const transport = this.emailSetup();
    let currentDate = new Date();
    let mail = {
      from: process.env.EMAIL_FROM || 'info@plotpeer.com', // sender address
      to: user, // ;list of receivers
      subject: 'Reset Password ✔', // Subject line
      html: `<p>Dear ${name}</p><h2> 
  You have requested to reset your password </h4> <br/> 
  <p>${currentDate.toLocaleDateString()}</p><br/>
  please click the button to reset your password <a href='${
    process.env.HOST
  }/auth/resetPassword?token=${token}'>reset Password</a>`, // html body
    };
    transport.sendMail(mail, (err, info) => {
      if (err) {
        console.error(err);
      }
      console.log(info);
    });
  };
  sendNewsLetter = (message, subject, ...users) => {
    let mail = {
      from: 'info@plotpeer.com', // sender address
      to: users, // list of receivers
      subject: subject, // Subject line
      text: message, // plain text body
      html: message, // html body
    };

    this.transport.sendMail(mail, (err, info) => {
      if (err) return console.error(err);
      console.log(info);
    });
  };
}
export default new EmailSender();