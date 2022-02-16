'use strict';

function numberFormatHelper(num, options = {}) {
const split = num.toString().split('.');
let before = split.shift();
let after = split.length ? split[0] : '';
const delimiter = options.delimiter || ',';
const separator = options.separator || '.';
const precision = options.precision;

if (delimiter) {
const beforeArr = [];
const beforeLength = before.length;
const beforeFirst = beforeLength % 3;

if (beforeFirst) beforeArr.push(before.substr(0, beforeFirst));

for (let i = beforeFirst; i < beforeLength; i += 3) {
beforeArr.push(before.substr(i, 3));
