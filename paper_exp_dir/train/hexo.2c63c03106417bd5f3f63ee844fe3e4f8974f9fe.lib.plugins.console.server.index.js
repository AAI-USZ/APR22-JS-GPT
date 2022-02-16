var express = require('express'),
path = require('path'),
colors = require('colors'),
async = require('async');

var config = hexo.config,
log = hexo.log,
route = hexo.route,
publicDir = hexo.public_dir;

module.exports = function(args, callback){
var app = express(),
port = parseInt(args.p || args.port || config.port, 10),
loggerFormat = args.l || args.log;


if (args.port > 65535 || args.port < 1){
port = 4000;
}


if (loggerFormat){
app.use(express.logger(typeof loggerFormat === 'string' ? loggerFormat : config.logger_format));
} else if (config.logger || hexo.debug){
app.use(express.logger(config.logger_format));
}


app.use(function(req, res, next){
res.header('x-powered-by', 'Hexo');
next();
});


if (!args.s && !args.static){
app.get(config.root + '*', function(req, res, next){
var url = route.format(req.params[0]),
target = route.get(url);


if (!target){
if (path.extname(url)) return next();

res.redirect(config.root + url + '/');
return;
}

target(function(err, result){
if (err) return next(err);

res.type(path.extname(url));

if (result.readable){
result.pipe(res).on('error', next);
} else {
res.end(result);
}
});
});
}


app.use(config.root, express.static(publicDir));


if (config.root !== '/'){
app.get('/', function(req, res){
res.redirect(config.root);
});
}


app.use(function(err, req, res, next){
log.e(err);
});


hexo.post.load({watch: true}, function(){

app.listen(port, function(){
log.i('Hexo is running at ' + 'localhost:%d%s'.underline + '. Press Ctrl+C to stop.', port, config.root);
hexo.emit('server');
});
});
};
