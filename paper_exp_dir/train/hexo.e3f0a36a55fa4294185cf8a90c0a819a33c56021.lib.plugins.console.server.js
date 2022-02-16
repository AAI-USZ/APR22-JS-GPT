var connect = require('connect'),
http = require('http'),
colors = require('colors'),
HexoError = require('../../error');

module.exports = function(args, callback){
var config = hexo.config,
log = hexo.log;

var app = connect(),
serverIp = args.i || args.ip || config.server_ip || '0.0.0.0',
port = parseInt(args.p || args.port || config.port, 10) || 4000,
useDrafts = args.d || args.drafts || config.render_drafts || false,
root = config.root;


if (port > 65535 || port < 1){
port = 4000;
}


if (useDrafts) {
hexo.extend.processor.register('_drafts/*path', require('../processor/post'));
}

hexo.extend.filter.apply('server_middleware', app);


hexo.post.load({watch: true}, function(err){
if (err) return callback(err);


var server = http.createServer(app).listen(port, serverIp, function(){
if (useDrafts){
log.i('Using drafts.');
}

log.i('Hexo is running at ' + 'http://%s:%d%s'.underline + '. Press Ctrl+C to stop.', serverIp, port, root);



hexo.emit('server');
});

server.on('error', function(err){
switch (err.code){
case 'EADDRINUSE':
err = HexoError.wrap(err, 'Port ' + port + ' has been used. Try other port instead.');
