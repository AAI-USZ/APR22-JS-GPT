var express = require('express'),
term = require('term'),
path = require('path'),
async = require('async'),
fs = require('graceful-fs'),
extend = require('../../extend'),
route = require('../../route'),
config = hexo.config,
publicDir = hexo.public_dir;

var randomPass = function(length){
var text = '0123456789abcdefghijklmnopqrstuvwxyz',
