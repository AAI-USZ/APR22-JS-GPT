var should = require('chai').should();

describe('number', function(){
var number = require('../../../lib/plugins/helper/number');

it('default', function(){
number.number_format(1234.567).should.eql('1,234.567');
});

it('precision', function(){
number.number_format(1234.567, {precision: false}).should.eql('1,234.567');
number.number_format(1234.567, {precision: 0}).should.eql('1,234');
number.number_format(1234.567, {precision: 1}).should.eql('1,234.6');
number.number_format(1234.567, {precision: 2}).should.eql('1,234.57');
number.number_format(1234.567, {precision: 3}).should.eql('1,234.567');
