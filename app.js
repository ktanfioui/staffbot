'use strict';
//var mongoClient = require('mongodb').MongoClient; // Récupération du client mongodb
var identifiant = require('./uniqid.js');
var nodemailer = require('nodemailer');
var dateTime = require('node-datetime');
var express = require('express'),
app = express(),
    session = require('express-session');
 // app server
var bodyParser = require('body-parser'); // parser for post requests
var Conversation = require('watson-developer-cloud/conversation/v1'); // watson sdk
var dt = dateTime.create();
var dateRec = dt.format('d-m-Y');

app.use(express.static('./public'));
app.use(bodyParser.json());
app.use(session({
    secret: '2C44-4D44-WppQ38S',
    resave: true,
    saveUninitialized: true
}));

//////////////////////////////index begin
app.use(function(req, res, next) {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
});


// Authentication and Authorization Middleware
var auth = function(req, res, next) {
  if (req.session && req.session.user === "WafaCashBot" && req.session.admin)
    return next();
  else
    return res.sendStatus(401);
};

//////generating the id in case of complaint
var reclamationID = identifiant.uniqID();
console.log(reclamationID);

//////Initialiser les variables du client
var matricule = null;
var codeagence = null;
var prenom = null;
var email = "k.lahlou@wafacash.com";
var objet = null;
var mailOptions = null;
// Login endpoint
app.get('/api/message', function (req, res) {
  matricule = req.query.matricule;
  codeagence = req.query.codeagence;
  objet = req.query.objet;
  console.log(objet);
  mailOptions = {
    from: 'khaoulatanfioui@gmail.com',
    to: email,
    subject: 'Accusée de reception de votre réclamation Wafacash',
    html: '<html><body> Bonjour ' + prenom + ', <br> Nous accusons réception de votre réclamation datée du: ' + dateRec + ' portant le numéro de ticket: ' + reclamationID + '<br>Pour un suivi en temps réel de votre réclamation, merci de vous connectez et saisir votre numéro de ticket via le lien suivant : <br><br>Pour plus d’informations, veuillez contacter le Centre Service Client au 05 22 43 50 50.</body></html>'
  };
  //insertClient(nom, prenom, email, tel, objet, langue);
  //console.log(langue);
	var username = "WafaCashBot";
  //exports.nom = nom;
	var pswd = "wafacashbot**2017";
  if (!username || !pswd) {
    res.send('login failed');
  } else if(username === "WafaCashBot" && pswd === "wafacashbot**2017") {
    req.session.user = username;
    req.session.admin = true;
    res.redirect('/conversation');
  }
});

// Logout endpoint
app.get('/logout', function (req, res) {
  req.session.destroy();
  //res.sendFile(__dirname+"/public/logout.html");
  res.redirect('/');
});

// Get content endpoint
app.get("/conversation", auth, function (request, response){
    response.sendFile(__dirname+"/public/conversation.html");
})

//////////////////index end
var conversation = new Conversation({
  version_date: Conversation.VERSION_DATE_2017_04_21
});

app.post('/api/message', function(req, res) {
//////Language detection and right workspace choice
  var workspace = null;
 workspace = process.env.WORKSPACE_ID1 || '<workspace-id>';

  if (!workspace || workspace === '<workspace-id>') {
    return res.json({
      'output': {
        'text': 'The workspace_id is needed'
      }
    });
  }
  //console.log(prenom);
  var iinput = {'text': objet};
  var payload = {
    workspace_id: workspace,
    context: req.body.context || {},
    input: req.body.input || iinput
  };
///////les variables de reclamation
  // Send the input to the conversation service


  conversation.message(payload, function(err, data) {
    if (err) {
      return res.status(err.code || 500).json(err);
    }
    else{


    var reponse = null;
    ///////Greetings with user's name

      if(data.output.text[0] == "Salut"){
      var reptext = data.output.text[0] + ' ' + prenom;
      var reponse = {
          "output" : {
            "text" : reptext,
          }
        }
    }
    //////Haha gif response to imagehaha
      else if (data.output.text[0] == "imagehaha") {
        var reptext = "<html> <body> <img src='https://www.dropbox.com/s/7rs4fm8lmqmhrz7/haha.gif?raw=1' alt='GIF haha' style='width:300px;height:160px;'> </body> </html>";
        var reponse = {
            "output" : {
              "text" : reptext,
            }
          }
      }

      //////Products menu response
        else if (data.output.text[0] == "nos produits") {
          var reptext = "<html>  <head> <script src='./public/js/jquery-3.2.1.js'></script> <script>  $(function(){ $('#includedContent').load('./public/slider.html'); }); </script> </head> <body> <div id='includedContent'></div></body> </html>";
          var reponse = {
              "output" : {
                "text" : reptext,
              }
            }
        }
       ///////////Réclamation
        /*else if (data.output.text[0] == "reclamation") {
          var reptext = "<html><body> <p>Laquelle de ces de options votre réclamation concerne ?</p>  <button class='button button5'>Qualité de service</button> <button class='button button5'>Nos produits wafacash</button>  </body> </html>";
          var reponse = {
              "output" : {
                "text" : reptext,
              }
            }
        }*/

        else if (data.output.text[0] == "<html><body>pouvez vous m'envoyer l'adresse de l'agence où s'est produit le problème?  par exemple:</br> adresse agence : Bir Anzarane Quartier Maarif, Casablanca </body></html>") {
          console.log("categLibelle : qualité de service");
          //var reptext = "Pouvez vous m'envoyer l'adresse de l'agence où vous aviez le problème ?";
          var reponse = data;

        }
        else if (data.output.text[0] == "produits wafacash") {
          var reptext = "<html><body> <p>Lequel de cess produits vous avez un problème avec ?</p> <button>Cash Express</button> <button>Carte Hissab Bikhir</button></body> </html>";
          var reponse = {
              "output" : {
                "text" : reptext,
              }
            }
        }
        else if (data.output.text[0] == "<html>y> Envoyez moi une description détaillée des faits, comme suit par exemple:</br> description : Changement support hissab bikhir </body></html>") {
          var address = data.output.context.adresse_entite;
          console.log(address);
          //reptext = "<html><body> D'accord, envoyer moi maintenant une description détaillé de ce qui s'est passé, par exemple:</br> description : j'ai été maltraitée par l'agent de sécurité </body></html>";
          var reponse = data;
        }
        else if (data.output.text[0] == "accusee de reception") {
          var descr = data.output.context.type_descr;
          console.log( descr);
          console.log("numero de ticket : " + reclamationID);
          sendEmail(mailOptions);
          reptext = "Merci, nous vous accusons reception de votre réclamation, voici votre N° de ticket: " + reclamationID +" nous vous enverrons un mail une fois votre réclamation sera traitée";
          var reponse = {
              "output" : {
                "text" : reptext,
              }
            }
        }



  else {reponse = data;}
      return res.json(updateMessage(payload, reponse));
    }

    //console.log('Bonjour ' + prenom + ', ' + data.output.text[0]);
//return res.json(updateMessage(payload, data));
  });

});

function insertClient(nom, prenom, email, tel, objet, langue) {
  var url = 'mongodb://localhost/mydb';

      // Connexion au serveur avec la méthode connect
      mongoClient.connect(url, function (err, db) {
          if (err) {
              return console.error('Connection failed', err);
          }
          console.log('Connection successful on ', url);

          // Nous allons travailler ici ...
          // Récupération de la collection clients
      var collection = db.collection('clients');
      var client = {nom: nom, prenom: prenom, email: email, tel: tel, objet: objet, langue: langue};
      collection.update(client, { "$set": client}, { "upsert": true });
      db.close();
     });
}

function insertReclamation(id, categLibelle, entite, type, callback){
  var url = 'mongodb://localhost/mydb';
      mongoClient.connect(url, function (err, db) {
          if (err) {
              return console.error('Connection failed', err);
          }
          console.log('Connection successful on ', url);
      var collection = db.collection('reclamations');
      var reclamation = {_id: id, categLibelle: categLibelle, entite: entite, type: type };
      collection.update(reclamation, { _id: reclamationID}, { "upsert": true });
      db.close();
      callback();
     });

}

function generateId(){
  var a = Math.floor((Math.random() * 5000) + 1);
  return a;
  //console.log("the random number is : " + a);
}


var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'khaoulatanfioui@gmail.com',
    pass: 'papaetmaman155'
  }
});
function sendEmail(mailData){
	transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent');
  }
});
}












function updateMessage(input, response) {
  var responseText = null;
  if (!response.output) {
    response.output = {};
  } else {
    return response;
  }
  response.output.text = responseText;
  return response;
}

module.exports = app;
