'use strict';

var should = require('chai').should();
var _ = require('lodash');

function ifTrue(cond, yes, no) {
return cond ? yes : no;
}

describe('toc', function() {
var toc = require('../../../lib/plugins/helper/toc');

var html = [
'<h1 id="title_1">Title 1</h1>',
'<h2 id="title_1_1">Title 1.1</h2>',
'<h3 id="title_1_1_1">Title 1.1.1</h3>',
'<h2 id="title_1_2">Title 1.2</h2>',
'<h2 id="title_1_3">Title 1.3</h2>',
'<h3 id="title_1_3_1">Title 1.3.1</h3>',
'<h1 id="title_2">Title 2</h1>',
'<h2 id="title_2_1">Title 2.1</h2>'
].join('');

var genResult = function(options) {
options = _.assign({
class: 'toc',
