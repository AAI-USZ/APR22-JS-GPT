

require.paths.unshift(__dirname + '/../../support');



var express = require('../../lib/express');



var pub = __dirname + '/public';




var app = express.createServer();
app.use(express.compiler({ src: pub, enable: ['sass'] }));
app.use(app.router);
app.use(express.static(pub));
app.use(express.errorHandler({ dump: true, stack: true }));



app.set('views', __dirname + '/views');




app.set('view engine', 'jade');

