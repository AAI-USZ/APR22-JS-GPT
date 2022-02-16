

require.paths.unshift(__dirname + '/../../support');



var express = require('../../lib/express');



var pub = __dirname + '/public';




var app = express.createServer(
express.compiler({ src: pub, enable: ['sass'] }),
express.staticProvider(pub)
);



app.set('views', __dirname + '/views');




app.set('view engine', 'jade');


var users = [
{ name: 'tj', email: 'tj@sencha.com' }
, { name: 'ciaran', email: 'ciaranj@gmail.com' }
, { name: 'aaron', email: 'aaron.heckmann+github@gmail.com' }
];

