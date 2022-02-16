var EventEmitter = require('events').EventEmitter;
var path = require('path');
var fs = require('fs');
var cli = require('../util/cli');
var createError = require('../util/createError');

function help(name) {
var json;
var emitter = new EventEmitter();

if (name) {
