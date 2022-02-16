


var express = require('../../')
, app = module.exports = express();







app.use(express.favicon());


if ('test' != process.env.NODE_ENV)
app.use(express.logger(':method :url'));





app.use(express.cookieParser('my secret here'));


app.use(express.bodyParser());

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
if (req.body.remember) res.cookie('remember', 1, { maxAge: minute });
res.redirect('back');
});


if (!module.parent) {
app.listen(3000);
console.log('Express started on port 3000');
