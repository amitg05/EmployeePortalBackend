const nodemailer = require('nodemailer');

function sendVerifyMail(name,email,Password,empcode,callback)
{  
    console.log("Mail Send Start") 
    // var link = "<b> http://localhost:8989/user/verifyuser?email="+email.trim()+"&otp="+otp+"</b>";
    var link = "<b> http://localhost:3000/</b>";

  
    
  
    var message = "<html><body><h1>Hello " + name + " !</h1><hr> &nbsp;&nbsp; Welcome to Intelliatech , Login credential for Intelliatech is <br> Email : "+email+" <br> password:"+Password+"  <br> Employee Code:"+empcode+"  <br><br> "+link+"</body></html>";

    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'jeetendralodhi108@gmail.com',
        pass: 'Jitu@1810'
      }
    });
    console.log("Mail Transport Start") 
    var mailOptions = {
      from: 'jeetendralodhi108@gmail.com',
      to: email,
      subject: 'Verification Email ',
      html: message
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) 
      {
        console.log(error) 
        callback(false);
      } else {
        callback(true);
      }
    });
}

module.exports = sendVerifyMail