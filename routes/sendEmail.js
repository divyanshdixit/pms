var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');

router.get('/', function(req, res, next){
    async function main() {
        // use below line only if real mail account is not present
        let testAccount = await nodemailer.createTestAccount();

        // transporter 
        let transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
              user: testAccount.user, // generated ethereal user
              pass: testAccount.pass, // generated ethereal password
            },
          })

        //   send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"Fred Foo 👻" <foo@example.com>', // sender address
            to: "bar@example.com, baz@example.com, divyanshdixit96@gmail.com", // list of receivers
            subject: "Hello ✔", // Subject line
            text: "Hello world?", // plain text body
            html: "<b>Hello world?</b>", // html body
          });

        //   check if mail sent or not
        if(info.messageId){
            console.log("Message sent: %s", info.messageId);
            res.send('mail sent');

        }else{
            res.send('Email not sent');
        }
          
        // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info))

  main().catch(console.error);
    }
})

module.exports = router