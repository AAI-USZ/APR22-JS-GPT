


var express = require('./../../lib/express');



var pub = __dirname + '/public';




var app = express.createServer(
express.compiler({ src: pub, enable: ['sass'] }),
express.staticProvider(pub)
);



app.set('views', __dirname + '/views');
