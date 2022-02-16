'use strict';

function jsHelper() {
var result = '';
var path = '';

for (var i = 0, len = arguments.length; i < len; i++) {
path = arguments[i];

if (i) result += '\n';

if (Array.isArray(path)) {
