var yaml = require('yamljs'),
_ = require('lodash'),
should = require('chai').should();

describe('Util - yfm', function(){
var yfm = require('../../lib/util/yfm');

describe('parse', function(){
it('only content', function(){
var str = [
'foo',
'bar'
].join('\n');

var data = yfm.parse(str);
data._content.should.eql(str);
});
