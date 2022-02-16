


var express = require('../../lib/express');

var app = express.createServer(


express.favicon(),


express.logger({ format: '\x1b[36m:method\x1b[0m \x1b[90m:url\x1b[0m :response-time' }),


express.cookieParser(),


express.bodyParser()
);

app.get('/', function(req, res){
if (req.cookies.remember) {
res.send('Remembered :). Click to <a href="/forget">forget</a>!.');
} else {
res.send('<form method="post"><p>Check to <label>'
+ '<input type="checkbox" name="remember"/> remember me</label> '
+ '<input type="submit" value="Submit"/>.</p></form>');
}
});

app.get('/forget', function(req, res){
res.clearCookie('remember');
res.redirect('back');
});

app.post('/', function(req, res){
var minute = 60000;
if (req.body.remember) {
res.cookie('remember', 1, { maxAge: minute, path: '/' });
}
res.redirect('back');
});

app.listen(3000);
