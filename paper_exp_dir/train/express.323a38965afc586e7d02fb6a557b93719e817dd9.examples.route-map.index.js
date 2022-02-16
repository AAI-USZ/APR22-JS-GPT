

var escapeHtml = require('escape-html')
var express = require('../../lib/express');

var verbose = process.env.NODE_ENV !== 'test'

var app = module.exports = express();

app.map = function(a, route){
route = route || '';
for (var key in a) {
