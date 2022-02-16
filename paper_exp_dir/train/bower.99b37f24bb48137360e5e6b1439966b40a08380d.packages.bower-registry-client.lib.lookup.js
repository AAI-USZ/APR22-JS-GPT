var path = require('path');
var url = require('url');
var async = require('async');
var request = require('request');
var mkdirp = require('mkdirp');
var createError = require('./util/createError');
var Cache = require('./util/Cache');

function lookup(name, options, callback) {
var data;
