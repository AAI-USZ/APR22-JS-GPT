var should = require('chai').should();

describe('number_format', () => {
var numberFormat = require('../../../lib/plugins/helper/number_format');

it('default', () => {
numberFormat(1234.567).should.eql('1,234.567');
});

it('precision', () => {
numberFormat(1234.567, {precision: false}).should.eql('1,234.567');
