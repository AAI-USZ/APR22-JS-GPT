




var multipart = require('multipart'),
utils = require('express/utils'),
http = require('http'),
fs = require('fs')

global.merge(require('express/event'))
global.merge(require('express/request'))
global.merge(require('express/plugin'))
global.merge(require('express/dsl'))



Route = new Class({



constructor: function(method, path, callback, options){
this.method = method
this.originalPath = path
