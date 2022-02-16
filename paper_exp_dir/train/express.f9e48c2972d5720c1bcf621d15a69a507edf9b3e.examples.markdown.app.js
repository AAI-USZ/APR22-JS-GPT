


var express = require('../../lib/express')
, md = require('node-markdown').Markdown;

var app = express.createServer();





app.register('.md', {
compile: function(str, options){
var html = md(str);
