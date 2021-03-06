var SparkBot = require('node-sparkbot');
var SparkAPIWrapper = require('node-sparkclient');

var bot = new SparkBot();
var spark = new SparkAPIWrapper(process.env.SPARK_TOKEN);

bot.onCommand('fallback', (command) => {
  var {
    roomId
  } = command.message;
  spark.createMessage(roomId, 'There\'s two choices here stranger /bank and /deposit', { markdown: true }, (err) => {
    if (err) {
      console.log(`WARNING: could not post Fallback message to room: ${roomId}`);
      return;
    }
  });
});

bot.onCommand('bank', (command) => {
  var {
    //id,
    roomId,
    // roomType,
    // toPersonId,
    // toPersonEmail,
    // text,
    // markdown,
    // files,
    // personId,
    personEmail, // Spark User that created the message orginally 
    // created,
    // mentionedPeople
  } = command.message;

  spark.createMessage(roomId, `<@personEmail:${personEmail}> the bank is open! Please set /amount`, { markdown: true }, (err) => {
    if (err) {
      console.log(`WARNING: couldn't POST /bank at: ${roomId}`);
      return;
    }
  });
});

bot.onCommand('amount', (command) => {
  var {
    //id,
    roomId,
    // roomType,
    // toPersonId,
    // toPersonEmail,
    text,
    // markdown,
    // files,
    // personId,
    personEmail, // Spark User that created the message orginally 
    // created,
    // mentionedPeople
  } = command.message;

  spark.createMessage(roomId, `The amount is set @ ${text.split(' ')[1]}!`, { markdown: true }, (err) => {
    if (err) {
      console.log(`WARNING: couldn't POST /bank at: ${roomId}`);
      return;
    }
  });
});

bot.onCommand('deposit', (command) => {
  var {
    // id,
    roomId,
    // roomType,
    // toPersonId,
    // toPersonEmail,
    // text,
    // markdown,
    // files,
    // personId,
    personEmail, // Spark User that created the message orginally 
    // created,
    // mentionedPeople
  } = command.message;

  spark.createMessage(roomId, `<@personEmail:${personEmail}> thanks for the deposit`, { markdown: true }, (err) => {
    if (err) {
      console.log(`WARNING: couldn't POST /deposit at: ${roomId}`);
      return;
    }
  });
});

bot.onEvent('memberships', 'created', (trigger) => {
  var {
    personId,
    roomId
  } = trigger.data; // see specs here: https://developer.ciscospark.com/endpoint-memberships-get.html
  if (personId != bot.interpreter.person.id) {
    // ignoring
    console.log('new membership fired, but it is not us being added to a room. Ignoring...');
    return;
  }

  console.log(`bot's just added to room: ${roomId}`);

  spark.createMessage(roomId, 'Hi, I am the harmless extortion bot! Type /bank to get started.', { markdown: true }, (err, message) => {
    if (err) {
      console.log(`WARNING: could not POST intro message to room at: ${roomId}`);
      return;
    }
 
    if (message.roomType === 'group') {
      spark.createMessage(roomId, 'Note I will wake up only when @mentionned.', { markdown: true }, (err) => {
        if (err) {
          console.log(`WARNING: could not post Mention message to room: ${roomId}`);
          return;
        }
      });
    }
  });
});
