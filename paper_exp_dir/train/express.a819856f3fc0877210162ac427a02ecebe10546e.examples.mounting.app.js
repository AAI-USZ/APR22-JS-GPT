

var express = require('../../')
, blog = require('../blog/app');

var app = module.exports = express();

app.use(express.cookieParser('keyboard cat'));
app.use(express.session());




app.use('/blog', blog);

app.get('/', function(req, res){
res.send('Visit <a href="/blog">/blog</a>');
})

if (!module.parent) {
app.listen(3000);
