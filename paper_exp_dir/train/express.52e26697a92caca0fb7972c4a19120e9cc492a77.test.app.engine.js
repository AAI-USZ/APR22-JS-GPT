
var express = require('../');

function render(str, options, fn) {
str = str.replace('{{user.name}}', options.user.name);
fn(null, str);
}

describe('app', function(){
describe('.engine(ext, fn)', function(){
it('should map a template engine', function(done){
