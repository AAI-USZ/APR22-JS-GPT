

'use strict';



var Route = require('./route');
var Layer = require('./layer');
var methods = require('methods');
var mixin = require('utils-merge');
var debug = require('debug')('express:router');
var deprecate = require('depd')('express');
var flatten = require('array-flatten');
var parseUrl = require('parseurl');
var setPrototypeOf = require('setprototypeof')



var objectRegExp = /^\[object (\S+)\]$/;
var slice = Array.prototype.slice;
var toString = Object.prototype.toString;



var proto = module.exports = function(options) {
var opts = options || {};

function router(req, res, next) {
