'use strict';

require('chai').should();
const _ = require('lodash');

function ifTrue(cond, yes, no) {
return cond ? yes : no;
}

describe('toc', () => {
