




var express = require('../..');

var app = express();

app.use(express.logger('dev'));




app.use(express.cookieParser('keyboard cat'));


app.use(express.session());

app.get('/', function(req, res){
var body = '';
if (req.session.views) {
++req.session.views;
} else {
req.session.views = 1;
body += '<p>First time visiting? view this page in several browsers :)</p>';
}
res.send(body + '<p>viewed <strong>' + req.session.views + '</strong> times.</p>');
});

