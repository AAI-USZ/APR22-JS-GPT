


var express = require('./../../lib/express'),
connect = require('connect');



var pub = __dirname + '/public';




var app = module.exports = express.createServer(
connect.compiler({ src: pub, enable: ['sass'] }),
connect.staticProvider(pub)
);



app.set('views', __dirname + '/views');



app.set('view reloading', { interval: 2000 });




