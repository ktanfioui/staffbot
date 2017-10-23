'use strict';

var express = require('express'),
app = express(),
    session = require('express-session');
 // app server
var bodyParser = require('body-parser'); // parser for post requests
var Conversation = require('watson-developer-cloud/conversation/v1'); // watson sdk


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

var prenom = null;
var objet = null;
var langue = null;
// Login endpoint
app.get('/api/message', function (req, res) {
  prenom = req.query.prenom;
  objet = req.query.objet;
  langue = req.query.langue;
  console.log(langue);
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
  if(langue == 'fr')
  { workspace = process.env.WORKSPACE_ID1 || '<workspace-id>';}
  if(langue == 'ar')
  { workspace = process.env.WORKSPACE_ID2 || '<workspace-id>';}

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


  else {reponse = data;}

      return res.json(updateMessage(payload, reponse));
    }
    //console.log('Bonjour ' + prenom + ', ' + data.output.text[0]);
//return res.json(updateMessage(payload, data));
  });
});


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
