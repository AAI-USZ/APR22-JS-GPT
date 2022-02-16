




var Request = require('express/request').Request,
normalizePath = require('express/request').normalizePath,
multipart = require('multipart'),
utils = require('express/utils'),
http = require('http'),
sys = require('sys'),
fs = require('fs')

global.merge(require('express/plugin'))
global.merge(require('express/dsl'))
