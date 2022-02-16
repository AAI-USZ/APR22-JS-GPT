var cheerio = require('cheerio'),
path = require('path'),
should = require('chai').should(),
file = require('../../../lib/util/file2'),
highlight = require('../../../lib/util/highlight');


function unique(arr){
var a = [],
l = arr.length;

for (var i = 0; i < l; i++){
for (var j = i + 1; j < l; j++){
if (arr[i] === arr[j]) j = ++i;
}

