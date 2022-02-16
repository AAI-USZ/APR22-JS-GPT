#!/usr/bin/env node

var fs = require('fs'),
file = process.argv[2];

if (file) {
var js = fs.readFileSync(file, 'utf8'),
headers = js.match(/<h3 id="(.*?)">(.*?)<\/h3>/g),
