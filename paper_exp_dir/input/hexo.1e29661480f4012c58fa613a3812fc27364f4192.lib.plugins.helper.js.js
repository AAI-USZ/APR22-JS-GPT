'use strict';

const { htmlTag } = require('hexo-util');
const url_for = require('./url_for');


const flatten = function(arr, result = []) {
for (const i in arr) {
const value = arr[i];
if (Array.isArray(value)) {
flatten(value, result);
} else {
result.push(value);
}
}
return result;
};

function jsHelper(...args) {
let result = '\n';
let items = args;

