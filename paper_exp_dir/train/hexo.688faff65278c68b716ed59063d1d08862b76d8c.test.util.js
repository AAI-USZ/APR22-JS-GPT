var util = require('../lib/util'),
file = util.file,
highlight = util.highlight,
titlecase = util.titlecase,
yfm = util.yfm;

describe('Utilities', function(){
describe('titlecase()', function(){
it('All upper case', function(){
titlecase('TODAY IS A BEATUIFUL DAY').should.equal('Today Is a Beatuiful Day');
});

it('All lower case', function(){
titlecase('today is a beatuiful day').should.equal('Today Is a Beatuiful Day');
});

it('Normal sentence', function(){
