'use strict';

var should = require('chai').should();

describe('number_format', function(){
var numberFormat = require('../../../lib/plugins/helper/number_format');

it('default', function(){
numberFormat(1234.567).should.eql('1,234.567');
});

