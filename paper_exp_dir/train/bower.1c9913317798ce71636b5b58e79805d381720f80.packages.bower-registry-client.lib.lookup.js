var async = require('async');
var request = require('request');
var url = require('url');
var createError = require('./util/createError');

function lookup(name, force, callback) {
var packageUrl;
var total;
var index = 0;
var options = this._options;
var registry = options.registry.search;

if (typeof force === 'function') {
callback = force;
force = false;
