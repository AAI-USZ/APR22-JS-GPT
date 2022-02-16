'use strict';

var should = require('chai').should();
var moment = require('moment');

var common = require('../../../lib/plugins/processor/common');

common.isTmpFile('foo').should.be.false;
common.isTmpFile('foo%').should.be.true;
common.isTmpFile('foo~').should.be.true;
});

