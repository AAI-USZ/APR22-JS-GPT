var should = require('should');

describe('Filters', function(){
describe('auto_spacing', function(){
var auto_spacing = require('../lib/plugins/filter/auto_spacing');

before(function(){
hexo.config.auto_spacing = true;
});

it('中文在前', function(){
auto_spacing({
content: '中文abc'
}, function(err, data){
should.not.exist(err);
});
});

it('中文在後', function(){
auto_spacing({
content: 'abc中文'
}, function(err, data){
should.not.exist(err);
});
});

it('字"字"字 >> 字 "字" 字', function(){
auto_spacing({
content: '中文"abc"中文'
}, function(err, data){
should.not.exist(err);
