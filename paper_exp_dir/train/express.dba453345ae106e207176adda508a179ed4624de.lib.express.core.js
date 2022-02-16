


process.mixin(require('sys'))
process.mixin(require('express/exceptions'))
process.mixin(require('express/collection'))
process.mixin(require('express/event'))
process.mixin(require('express/request'))
process.mixin(require('express/plugin'))
process.mixin(require('express/dsl'))



var multipart = require('multipart'),
events = require('events'),
File = require('file').File,
utils = require('express/utils')



Route = Class({



init: function(method, path, fn, options){
this.method = method
this.originalPath = path
this.path = this.normalize(path)
