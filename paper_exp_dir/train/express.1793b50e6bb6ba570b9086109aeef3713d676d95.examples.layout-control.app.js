


var express = require('../../lib/express')
, url = require('url');

var app = express.createServer();

app.set('views', __dirname + '/views');


app.register('html', require('ejs'));
app.set('view engine', 'html');


app.locals.layout = 'layouts/default';

app.use(function(req, res, next){

res.locals.path = url.parse(req.url).pathname;


res.locals.contentFor = function(section, str){
res.locals[section] = str;
};

next();
});
