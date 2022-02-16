




var multipart = require('multipart'),
utils = require('express/utils'),
events = require('events'),
fs = require('fs')

global.merge(require('sys'))
global.merge(require('express/event'))
global.merge(require('express/request'))
global.merge(require('express/plugin'))
global.merge(require('express/dsl'))



Route = Class({



init: function(method, path, fn, options){
this.method = method
this.originalPath = path
