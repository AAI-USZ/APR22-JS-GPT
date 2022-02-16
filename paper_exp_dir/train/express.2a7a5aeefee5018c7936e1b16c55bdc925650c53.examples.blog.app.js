

require.paths.unshift(__dirname + '/../../support');



var express = require('../../lib/express')
, messages = require('express-contrib/messages');

app = express.createServer();



app.set('views', __dirname + '/views');
app.set('view engine', 'jade');




app.dynamicHelpers({ messages: messages });



app.configure(function(){
app.use(express.logger('\x1b[33m:method\x1b[0m \x1b[32m:url\x1b[0m :response-time'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({ secret: 'keyboard cat' }));
app.use(app.router);
app.use(express.static(__dirname + '/public'));
app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});



require('./routes/site');
require('./routes/post');

app.listen(3000);
console.log('Express started on port 3000');
