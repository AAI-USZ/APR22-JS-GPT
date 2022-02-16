

var utils = require('express/utils');
utils.mixin(require('sys'))
utils.mixin(require('express/exceptions'))
utils.mixin(require('express/collection'))
utils.mixin(require('express/event'))
utils.mixin(require('express/request'))
utils.mixin(require('express/plugin'))
utils.mixin(require('express/dsl'))



var multipart = require('multipart'),
events = require('events'),
fs = require('fs')

