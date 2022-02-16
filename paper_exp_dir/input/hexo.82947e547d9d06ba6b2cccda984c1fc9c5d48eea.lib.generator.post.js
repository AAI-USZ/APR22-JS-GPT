var async = require('async'),
path = require('path'),
extend = require('../extend'),
util = require('../util'),
file = util.file;

extend.generator.register(function(locals, render, callback){
