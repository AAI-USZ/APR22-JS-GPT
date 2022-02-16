var connect = require('connect'),
http = require('http'),
path = require('path'),
colors = require('colors'),
logger = require('morgan'),
serveStatic = require('serve-static'),
compress = require('compression'),
mime = require('mime');

var redirect = function(res, dest){
res.statusCode = 302;
res.setHeader('Location', dest);
res.end('Redirecting to ' + dest);
};

var contentType = function(res, type){
res.setHeader('Content-Type', ~type.indexOf('/') ? type : mime.lookup(type));
};

module.exports = function(args, callback){
