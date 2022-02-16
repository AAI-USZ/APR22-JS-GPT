'use strict';

var pathFn = require('path');
var Promise = require('bluebird');
var _ = require('lodash');
var File = require('./file');
var util = require('hexo-util');
var fs = require('hexo-fs');
var chalk = require('chalk');
var hash = require('../hash');
var EventEmitter = require('events').EventEmitter;

var Pattern = util.Pattern;
var join = pathFn.join;
var sep = pathFn.sep;

var defaultPattern = new Pattern(function() {
return {};
});

function Box(ctx, base, options) {
EventEmitter.call(this);

this.options = _.extend({
persistent: true
}, options);

if (base.substring(base.length - 1) !== sep) {
