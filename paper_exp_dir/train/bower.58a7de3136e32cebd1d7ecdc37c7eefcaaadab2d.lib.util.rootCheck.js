
'use strict';
var isRoot = require('is-root');
var createError = require('./createError');

var renderer;

function rootCheck(options, config) {
var errorMsg;


if (options.allowRoot || config.allowRoot) {
return;
}

