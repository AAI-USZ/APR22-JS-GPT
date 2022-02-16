'use strict';

function relativeUrlHelper(from = '', to = '') {
const fromParts = from.split('/');
const toParts = to.split('/');
const length = Math.min(fromParts.length, toParts.length);
let i = 0;

for (; i < length; i++) {
if (fromParts[i] !== toParts[i]) break;
}

