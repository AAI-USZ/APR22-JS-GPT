'use strict';

function relativeUrlHelper(from, to){
from = from || '';
to = to || '';

var fromParts = from.split('/');
var toParts = to.split('/');
var length = Math.min(fromParts.length, toParts.length);
var i = 0;

for (; i < length && fromParts[i] === toParts[i]; i++);

