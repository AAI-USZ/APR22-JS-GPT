var express = require('express'),
term = require('term'),
path = require('path'),
ejs = require('ejs'),
extend = require('../../extend'),
route = require('../../route'),
config = hexo.config;

var randomPass = function(length){
var text = '0123456789abcdefghijklmnopqrstuvwxyz',
total = text.length,
result = '';

for (var i=0; i<length; i++){
result += text.substr(parseInt(Math.random() * total), 1);
}

return result;
};

extend.console.register('preview', 'Preview site', function(args){
var app = express(),
admin = args.a || args.admin ? true : false,
generate = require('../../generate');

if (args.p){
var port = args.p;
} else if (args.port){
var port = args.port;
} else {
var port = config.port;
}

if (config.logger){
if (config.logger_format) app.use(express.logger(config.logger_format));
else app.use(express.logger());
} else if (hexo.debug){
app.use(express.logger());
}

app.set('views', __dirname + '/../../../views');
app.set('view engine', 'ejs');
app.locals.layout = 'layout';
app.engine('ejs', require('../../render').__express);

if (admin){
var adminPass = config.admin_pass || randomPass(8);

app.use(express.bodyParser());
app.use(express.cookieParser('nAL1o1D5wlBn96T'));
app.use(express.session());

app.get('/admin/auth', function(req, res, next){
if (req.session.authed){
next();
} else {
res.render('auth');
}
