


var Route = require('./route');
var Layer = require('./layer');
var methods = require('methods');
var mixin = require('utils-merge');
var debug = require('debug')('express:router');
var parseUrl = require('parseurl');
var utils = require('../utils');



var objectRegExp = /^\[object (\S+)\]$/;
