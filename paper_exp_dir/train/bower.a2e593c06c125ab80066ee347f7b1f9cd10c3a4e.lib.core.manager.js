














var Package = require('./package');
var config  = require('./config');
var prune   = require('../util/prune');
var events  = require('events');
var async   = require('async');
var path    = require('path');
var glob    = require('glob');
var fs      = require('fs');






var Manager = function (endpoints) {
