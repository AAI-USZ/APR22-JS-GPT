'use strict';

const strip = require('strip-ansi');

exports.stringLength = str => {
str = strip(str);

const len = str.length;
let result = len;


for (let i = 0; i < len; i++) {
if (str.charCodeAt(i) > 255) {
result++;
}
}

return result;
};
