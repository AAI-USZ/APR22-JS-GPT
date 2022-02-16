'use strict';

function numberFormatHelper(num, options) {
options = options || {};

var split = num.toString().split('.');
var before = split.shift();
var after = split.length ? split[0] : '';
var delimiter = options.delimiter || ',';
var separator = options.separator || '.';
var precision = options.precision;
var i, len;
