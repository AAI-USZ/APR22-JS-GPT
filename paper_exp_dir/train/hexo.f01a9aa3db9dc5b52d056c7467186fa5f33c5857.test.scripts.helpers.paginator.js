'use strict';

var should = require('chai').should();

describe('paginator', function() {
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(__dirname);

var ctx = {
page: {
base: '',
total: 10
},
site: hexo.locals,
config: hexo.config
};

ctx.url_for = require('../../../lib/plugins/helper/url_for').bind(ctx);

var paginator = require('../../../lib/plugins/helper/paginator').bind(ctx);

function link(i) {
return ctx.url_for(i === 1 ? '' : 'page/' + i + '/');
}

function checkResult(result, data) {
var expected = '';
var current = data.current;
var total = data.total;
var pages = data.pages;
var space = data.space || '&hellip;';
var prevNext = data.hasOwnProperty('prev_next') ? data.prev_next : true;
var num;

if (prevNext && current > 1) {
expected += '<a class="extend prev" rel="prev" href="' + link(current - 1) + '">Prev</a>';
}

for (var i = 0, len = pages.length; i < len; i++) {
num = pages[i];

if (!num) {
expected += '<span class="space">' + space + '</span>';
} else if (num === current) {
expected += '<span class="page-number current">' + current + '</span>';
} else {
expected += '<a class="page-number" href="' + link(num) + '">' + num + '</a>';
}
}

if (prevNext && current < total) {
expected += '<a class="extend next" rel="next" href="' + link(current + 1) + '">Next</a>';
}

result.should.eql(expected);
}

[
[1, 2, 3, 0, 10],
[1, 2, 3, 4, 0, 10],
[1, 2, 3, 4, 5, 0, 10],
[1, 2, 3, 4, 5, 6, 0, 10],
[1, 0, 3, 4, 5, 6, 7, 0, 10],
[1, 0, 4, 5, 6, 7, 8, 0, 10],
[1, 0, 5, 6, 7, 8, 9, 10],
[1, 0, 6, 7, 8, 9, 10],
[1, 0, 7, 8, 9, 10],
[1, 0, 8, 9, 10]
].forEach(function(pages, i, arr) {
var current = i + 1;
var total = arr.length;

it('current = ' + current, function() {
