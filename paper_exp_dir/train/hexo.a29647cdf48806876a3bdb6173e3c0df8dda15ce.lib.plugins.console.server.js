var express = require('express'),
path = require('path'),
colors = require('colors');

module.exports = function(args, callback){
var config = hexo.config,
log = hexo.log,
route = hexo.route,
processor = hexo.extend.processor;

var app = express(),
serverIp = args.i || args.ip || config.server_ip || '0.0.0.0',
port = parseInt(args.p || args.port || config.port, 10) || 4000,
useDrafts = args.d || args.drafts || config.render_drafts || false,
loggerFormat = args.l || args.log,
root = config.root;


if (port > 65535 || port < 1){
port = 4000;
}


if (useDrafts) {
processor.register('_drafts/*path', require('../processor/post'));
}


if (loggerFormat){
app.use(express.logger(typeof loggerFormat === 'string' ? loggerFormat : config.logger_format));
} else if (config.logger || hexo.debug){
app.use(express.logger(config.logger_format));
}


app.use(function(req, res, next){
res.header('X-Powered-By', 'Hexo');
next();
});


if (!args.s && !args.static){
app.get(root + '*', function(req, res, next){
var url = route.format(req.params[0]),
target = route.get(url);


if (!target){
if (path.extname(url)) return next();

res.redirect(root + url + '/');
return;
}

target(function(err, result){
if (err) return next(err);
if (typeof result === 'undefined') return next();

res.type(path.extname(url));

if (result.readable){
result.pipe(res).on('error', next);
} else {
res.end(result);
}
