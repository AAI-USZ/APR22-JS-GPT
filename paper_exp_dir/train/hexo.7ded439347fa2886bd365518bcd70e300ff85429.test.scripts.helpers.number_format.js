'use strict';

require('chai').should();

describe('number_format', () => {
const numberFormat = require('../../../lib/plugins/helper/number_format');

it('default', () => {
numberFormat(1234.567).should.eql('1,234.567');
});

