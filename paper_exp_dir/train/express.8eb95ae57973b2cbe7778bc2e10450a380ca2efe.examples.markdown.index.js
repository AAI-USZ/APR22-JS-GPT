

var escapeHtml = require('escape-html');
var express = require('../..');
var fs = require('fs');
var marked = require('marked');
var path = require('path');

var app = module.exports = express();



app.engine('md', function(path, options, fn){
fs.readFile(path, 'utf8', function(err, str){
if (err) return fn(err);
var html = marked.parse(str).replace(/\{([^}]+)\}/g, function(_, name){
return escapeHtml(options[name] || '');
});
