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

if (!Array.isArray(args)) {
items = [args];
}

items = flatten(items);

items.forEach(item => {

if (typeof item === 'string' || item instanceof String) {
let path = item;
if (!path.endsWith('.js')) {
path += '.js';
}
result += `<script src="${this.url_for(path)}"></script>\n`;
} else {

item.src = url_for.call(this, item.src);
result += htmlTag('script', { ...item }, '') + '\n';
}
});
return result;
}

module.exports = jsHelper;
