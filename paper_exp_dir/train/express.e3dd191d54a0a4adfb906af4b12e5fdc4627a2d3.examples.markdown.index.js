

var escapeHtml = require('escape-html');
var express = require('../..');
var fs = require('fs');
var marked = require('marked');

var app = module.exports = express();



app.engine('md', function(path, options, fn){
fs.readFile(path, 'utf8', function(err, str){
if (err) return fn(err);
