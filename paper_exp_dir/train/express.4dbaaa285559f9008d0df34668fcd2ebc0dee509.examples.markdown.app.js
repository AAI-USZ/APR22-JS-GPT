


var express = require('../../')
, fs = require('fs')
, md = require('node-markdown').Markdown;

var app = module.exports = express();



app.engine('md', function(path, options, fn){
fs.readFile(path, 'utf8', function(err, str){
if (err) return fn(err);
try{
var html = md(str);
