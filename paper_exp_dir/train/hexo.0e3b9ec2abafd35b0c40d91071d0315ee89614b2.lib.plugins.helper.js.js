'use strict';

const { htmlTag } = require('hexo-util');


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
