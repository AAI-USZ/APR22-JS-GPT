

var express = require('../../lib/express');
var path = require('path');



var pub = path.join(__dirname, 'public');



var app = express();
app.use(express.static(pub));



app.set('views', path.join(__dirname, 'views'));




app.set('view engine', 'jade');
