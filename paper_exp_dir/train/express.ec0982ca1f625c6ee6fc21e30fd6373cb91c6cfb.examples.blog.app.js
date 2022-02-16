

require.paths.unshift(__dirname + '/../../support');



var express = require('../../lib/express')
, messages = require('express-contrib/messages');

app = express.createServer();



app.set('views', __dirname + '/views');
app.set('view engine', 'jade');




app.dynamicHelpers({ messages: messages });
