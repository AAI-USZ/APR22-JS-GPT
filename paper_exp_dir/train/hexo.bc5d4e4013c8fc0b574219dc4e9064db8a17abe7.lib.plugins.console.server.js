var express = require('express'),
term = require('term'),
path = require('path'),
async = require('async'),
fs = require('graceful-fs'),
_ = require('lodash'),
extend = require('../../extend'),
route = require('../../route'),
config = hexo.config,
publicDir = hexo.public_dir;

var randomPass = function(length){
var text = '0123456789abcdefghijklmnopqrstuvwxyz',
total = text.length,
result = '';

for (var i=0; i<length; i++){
result += text.substr(parseInt(Math.random() * total), 1);
}

return result;
};

extend.console.register('server', 'Run server', function(args){
var app = express(),

admin = false,
statics = args.s || args.static ? true : false,
log = args.l || args.log,
port = args.p || args.port || config.port,
generate = require('../../generate');

app.set('views', hexo.core_dir + 'views');
app.set('view engine', 'ejs');
app.locals.config = config;
app.locals.version = hexo.version;


app.engine('ejs', require('../../render').renderFile);

app.resource = function(){
var args = _.toArray(arguments),
path = args.shift(),
obj = args.pop();

if (obj.index) app.get.apply(app, [].concat(path, args, obj.index));
if (obj.new) app.get.apply(app, [].concat(path + '/new', args, obj.new));
if (obj.create) app.post.apply(app, [].concat(path, args, obj.create));
if (obj.show) app.get.apply(app, [].concat(path + '/:id', args, obj.show));
if (obj.edit) app.get.apply(app, [].concat(path + '/:id/edit', args, obj.edit));
if (obj.update) app.put.apply(app, [].concat(path + '/:id', args, obj.update));
if (obj.destroy) app.del.apply(app, [].concat(path + '/:id', args, obj.destroy));

return this;
};

if (log){
app.use(express.logger(log));
} else if (config.logger){
if (config.logger_format) app.use(express.logger(config.logger_format));
else app.use(express.logger());
} else if (hexo.debug){
app.use(express.logger());
}

var startServer = function(){
app.use(config.root, express.static(publicDir));

if (config.root !== '/'){
app.get('/', function(req, res){
res.redirect(config.root);
});
}

app.use(function(req, res){
res.status(404).end('404 Not Found');
});

