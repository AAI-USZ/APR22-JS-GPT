var mout = require('mout');
var nopt = require('nopt');
var renderers = require('../renderers');
var createError = require('./createError');

var READ_OPTIONS_ERROR_CODE = 'EREADOPTIONS';

function readOptions(options, argv) {
var types;
var noptOptions;
var parsedOptions = {};
var shorthands = {};

