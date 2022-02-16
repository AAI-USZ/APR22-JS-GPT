var os = require('os');
var path = require('path');
var fs = require('fs');
var builder = require('xmlbuilder');

var u = require('../util');
var log = require('../logger').create('reporter');


var JUnitReporter = function(formatError, outputFile, pkgName) {
var xml;
var suites;

