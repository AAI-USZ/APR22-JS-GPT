var connect = require('connect'),
http = require('http'),
colors = require('colors');

module.exports = function(args, callback){
var config = hexo.config,
log = hexo.log;

var app = connect(),
serverIp = args.i || args.ip || config.server_ip || '0.0.0.0',
port = parseInt(args.p || args.port || config.port, 10) || 4000,
useDrafts = args.d || args.drafts || config.render_drafts || false,
