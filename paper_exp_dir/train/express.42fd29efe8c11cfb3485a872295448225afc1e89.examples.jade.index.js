


var express = require('../../lib/express');



var pub = __dirname + '/public';



var app = express();
app.use(app.router);
app.use(express.static(pub));
app.use(express.errorHandler());



app.set('views', __dirname + '/views');




app.set('view engine', 'jade');

function User(name, email) {
