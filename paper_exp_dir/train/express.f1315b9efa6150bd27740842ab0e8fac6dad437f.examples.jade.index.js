


var express = require('../../lib/express');



var pub = __dirname + '/public';



var app = express();
app.use(express.static(pub));



app.set('views', __dirname + '/views');




app.set('view engine', 'jade');

function User(name, email) {
this.name = name;
this.email = email;
}
