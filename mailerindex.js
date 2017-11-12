  
var identifiant = require('./mailertest.js');
  
  
var mailOptions = {
  from: 'khaoulatanfioui@gmail.com',
  to: 'khaoulatanfioui2@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'an automatic mail'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent');
  }
});