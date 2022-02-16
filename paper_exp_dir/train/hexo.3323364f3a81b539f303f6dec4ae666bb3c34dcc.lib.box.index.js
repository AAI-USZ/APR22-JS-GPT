var pathFn = require('path');
var Promise = require('bluebird');
var _ = require('lodash');
var chokidar = require('chokidar');
var File = require('./file');
var Pattern = require('./pattern');
var util = require('../util');
var fs = util.fs;

require('colors');

function Box(context, base, options){
this.context = context;
this.base = base;
this.processors = [];
this.processingFiles = {};
this.watcher = null;
this.isProcessing = false;
this.options = _.extend({
presistent: true,
ignored: /[\/\\]\./,
