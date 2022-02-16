var path = require('path');
var url = require('url');
var async = require('async');
var request = require('request');
var createError = require('./util/createError');
var Cache = require('./util/Cache');

function lookup(name, options, callback) {
var data;
var that = this;
var registry = this._config.registry.search;
var total = registry.length;
var index = 0;

