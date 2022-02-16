

var express = require('../../');

var app = module.exports = express();




app.use(express.bodyParser());




app.use(express.methodOverride());


app.use(express.cookieParser());



app.use(express.session({ secret: 'keyboard cat' }));
