require('chai').should();
const _ = require('lodash');

function ifTrue(cond, yes, no) {
return cond ? yes : no;
}

describe('toc', () => {
const toc = require('../../../lib/plugins/helper/toc');

