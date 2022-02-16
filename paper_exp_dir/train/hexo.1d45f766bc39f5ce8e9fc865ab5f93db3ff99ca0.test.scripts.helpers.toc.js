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
