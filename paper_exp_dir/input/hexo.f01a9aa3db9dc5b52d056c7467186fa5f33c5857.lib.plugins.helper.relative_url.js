'use strict';

from = from || '';
to = to || '';

var fromParts = from.split('/');
var toParts = to.split('/');
var length = Math.min(fromParts.length, toParts.length);
var i = 0;

