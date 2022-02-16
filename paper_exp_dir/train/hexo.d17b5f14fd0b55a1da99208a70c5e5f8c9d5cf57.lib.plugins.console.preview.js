var express = require('express'),
term = require('term'),
path = require('path'),
ejs = require('ejs'),
extend = require('../../extend'),
route = require('../../route'),
config = hexo.config;

var randomPass = function(length){
var text = '0123456789abcdefghijklmnopqrstuvwxyz',
total = text.length,
result = '';

for (var i=0; i<length; i++){
result += text.substr(parseInt(Math.random() * total), 1);
}

return result;
};
