

var express = require('../../');
var GithubView = require('./github-view');
var md = require('marked').parse;

var app = module.exports = express();


app.engine('md', function(str, options, fn){
try {
var html = md(str);
html = html.replace(/\{([^}]+)\}/g, function(_, name){
return options[name] || '';
