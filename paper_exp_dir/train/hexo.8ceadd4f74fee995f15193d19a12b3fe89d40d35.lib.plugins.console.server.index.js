var express = require('express'),
path = require('path'),
async = require('async'),
_ = require('lodash'),
extend = require('../../../extend'),
route = require('../../../route'),
config = hexo.config,
log = hexo.log,
publicDir = hexo.public_dir;

var randomPassword = function(length){
var txt = '0123456789abcdefghijklmnopqrstuvwxyz',
total = txt.length,
result = '';

for (var i = 0; i < length; i++){
result += txt.substr(parseInt(Math.random() * total), 1);
}

return result;
