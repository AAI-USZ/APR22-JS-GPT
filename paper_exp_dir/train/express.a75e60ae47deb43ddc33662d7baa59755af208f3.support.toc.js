#!/usr/bin/env node

var fs = require('fs'),
file = process.argv[2];

if (file) {
var html = fs.readFileSync(file, 'utf8')
, toc = ['<ul id="toc">']
, sections = {};

html = html.replace(/<h3>(.*?)<\/h3>/g, function(_, title){
var id = title.toLowerCase().replace(' ', '-').replace(/\(.*?\)/, '()');
if (~title.indexOf('.')) {
var parts = title.split('.')
, recv = parts.shift()
, method = parts.shift().replace(/\(.*?\)/, '()');
