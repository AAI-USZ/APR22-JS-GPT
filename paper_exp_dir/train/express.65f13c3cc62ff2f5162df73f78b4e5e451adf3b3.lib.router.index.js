

var Route = require('./route');
var utils = require('../utils');
var methods = require('methods');
var debug = require('debug')('express:router');
var parseUrl = require('parseurl');



exports = module.exports = Router;



function Router(options) {
options = options || {};
var self = this;
this.map = {};
this.params = {};
