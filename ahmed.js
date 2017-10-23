var detectedLanguage='french';
var BotLanguage='french';

controller.on('message_received', function(bot, message) {
const Translate = require('@google-cloud/translate');
// Instantiates a client
const translateClient = Translate({
  projectId: 'my-project-1506079858975',
  key : 'AIzaSyCr1Uy6nriZTlhY_w1Va2TDp-uSWYYdFEg'
});


  // The text for which to detect language, e.g. "Hello, world!"
  const text = message.text;
  console.log(message.text);

  // Detects the language. "text" can be a string for detecting the language of
  // a single piece of text, or an array of strings for detecting the languages
  // of multiple texts.
   translateClient.detect(text)
    .then((results) => {
      let detections = results[0];
      detections = Array.isArray(detections) ? detections : [detections];

      console.log('Detections:');
      detections.forEach((detection) => {
        //console.log(${detection.input} => ${detection.language});
		detectedLanguage=detection.language;

      });
	  console.log('detectedLanguage' +detectedLanguage);
	  if (detectedLanguage=='ar'||detectedLanguage=='fa'){
      BotLanguage= 'arabe';
	  console.log('botLanguage avant sortie' +BotLanguage);
	  }
	  else {
	  BotLanguage= 'french';
	  }
    })
    .catch((err) => {
      console.error('ERROR:', err);
    });
console.log('botLanguage' +BotLanguage);

});
