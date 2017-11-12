var nodemailer = require('nodemailer');
var dateTime = require('node-datetime');


var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'khaoulatanfioui@gmail.com',
    pass: 'papaetmaman155'
  }
});

var name = "khaoula";
var ticket = "13456-78";

var dt = dateTime.create();
var formatted = dt.format('d-m-Y');
console.log(formatted);

var mailOptions = {
  from: 'khaoulatanfioui@gmail.com',
  to: 'khaoulatanfioui2@gmail.com',
  subject: 'Sending Email using Node.js',
  html: '<html><body>Bonjour Mme' + name + ', <br> Nous accusons réception de votre réclamation datée du jj/mm/aaaa portant le numéro de ticket: ' + ticket + '<br>Pour un suivi en temps réel de votre réclamation, merci de vous connectez et saisir votre numéro de ticket via le lien suivant : <br><br>Pour plus d’informations, veuillez contacter le Centre Service Client au 0522 4 3 50 50.</body></html>'
};

//sendEmail(mailOptions);

function sendEmail(mailData){
	transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent');
  }
});
}
