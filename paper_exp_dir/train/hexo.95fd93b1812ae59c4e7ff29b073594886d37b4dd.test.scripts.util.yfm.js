var yaml = require('yamljs'),
_ = require('lodash'),
moment = require('moment'),
should = require('chai').should();

describe('Util - yfm', function(){
var yfm = require('../../../lib/util/yfm');

describe('parse', function(){
it('only content', function(){
var str = [
'foo',
'bar'
].join('\n');

var data = yfm.parse(str);
data._content.should.eql(str);
});

it('only content (with ---)', function(){
var str = [
'foo',
'---',
'str'
].join('\n');

var data = yfm.parse(str);
data._content.should.eql(str);
});

it('new style', function(){
var str = [
'layout: post',
'---',
'123'
].join('\n');

var data = yfm.parse(str);
data.layout.should.eql('post');
data._content.should.eql('123');
});

it('new style (without content)', function(){
var str = [
'layout: post',
'---'
].join('\n');

var data = yfm.parse(str);
data.layout.should.eql('post');
data._content.should.eql('');
});

it('new style (trim)', function(){
var str = [
'',
'layout: post',
'',
'---',
'',
'',
'',
'123'
].join('\n');

var data = yfm.parse(str);
data.layout.should.eql('post');
data._content.should.eql('123');
});

it('new style (more than 3 dashes)', function(){
var str = [
'layout: post',
'------',
'123'
].join('\n');

var data = yfm.parse(str);
data.layout.should.eql('post');
data._content.should.eql('123');
});

it('old style', function(){
var str = [
'---',
'layout: post',
'---',
'123'
].join('\n');

var data = yfm.parse(str);
data.layout.should.eql('post');
data._content.should.eql('123');
});

it('old style (without content)', function(){
var str = [
'---',
'layout: post',
'---'
].join('\n');

var data = yfm.parse(str);
data.layout.should.eql('post');
data._content.should.eql('');
});

it('old style (trim)', function(){
var str = [
'---',
'',
'layout: post',
'',
'---',
'',
'',
'',
'123'
].join('\n');

var data = yfm.parse(str);
data.layout.should.eql('post');
data._content.should.eql('123');
});

it('old style (more than 3 dashes)', function(){
var str = [
'----',
'layout: post',
'------',
'123'
].join('\n');

var data = yfm.parse(str);
data.layout.should.eql('post');
data._content.should.eql('123');
});

it('with inline separator', function(){
var str = [
'layout: post',
'title: This title including --------',
'---',
'123'
].join('\n');

var data = yfm.parse(str);
data.layout.should.eql('post');
data.title.should.eql('This title including --------');
data._content.should.eql('123');
});

it('with another separator', function(){
var str = [
'title: Hello World',
'---',
'',
'Hello',
'-----------------------------------'
].join('\n');

