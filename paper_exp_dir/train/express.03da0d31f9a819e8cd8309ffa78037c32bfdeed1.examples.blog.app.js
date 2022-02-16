

require.paths.unshift(__dirname + '/../../support');



var express = require('../../lib/express');

app = express.createServer();



app.set('views', __dirname + '/views');
app.set('view engine', 'jade');



app.configure(function(){
app.use(express.logger('\x1b[33m:method\x1b[0m \x1b[32m:url\x1b[0m :response-time'));
app.use(express.bodyDecoder());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.staticProvider(__dirname + '/public'));
app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});



require('./routes/site');
require('./routes/post');

app.listen(3000);
