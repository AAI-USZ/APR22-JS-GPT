var should = require('chai').should();
var _ = require('lodash');

function ifTrue(cond, yes, no) {
return cond ? yes : no;
}

describe('toc', () => {
var toc = require('../../../lib/plugins/helper/toc');

