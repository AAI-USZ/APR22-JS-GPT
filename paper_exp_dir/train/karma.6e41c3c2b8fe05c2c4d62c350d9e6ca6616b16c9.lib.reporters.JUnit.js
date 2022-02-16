var os = require('os');
var path = require('path');
var fs = require('fs');
var builder = require('xmlbuilder');

var u = require('../util');
var log = require('../logger').create('reporter');


var JUnitReporter = function(formatError, outputFile, pkgName, emitter) {
var xml;
var suites;
var pendingFileWritings = 0;
var fileWritingFinished = function() {};

this.adapters = [];

this.onRunStart = function(browsers) {
suites = {};
xml = builder.create('testsuites');

var suite;
