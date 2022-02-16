
var express = require('../')
, fs = require('fs');

function render(path, options, fn) {
fs.readFile(path, 'utf8', function(err, str){
if (err) return fn(err);
str = str.replace('{{user.name}}', options.user.name);
fn(null, str);
});
}
