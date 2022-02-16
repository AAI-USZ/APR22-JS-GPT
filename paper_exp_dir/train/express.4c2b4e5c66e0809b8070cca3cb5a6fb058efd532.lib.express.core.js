




var multipart = require('multipart'),
utils = require('express/utils'),
fs = require('fs')

global.merge(require('sys'))
global.merge(require('express/event'))
global.merge(require('express/request'))
global.merge(require('express/plugin'))
global.merge(require('express/dsl'))



Route = new Class({

