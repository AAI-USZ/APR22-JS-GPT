var should = require('chai').should();
var Promise = require('bluebird');
var Readable = require('stream').Readable;
var testUtil = require('../../util');

describe('Router', function(){
var Router = require('../../../lib/hexo/router');
var router = new Router();

function checkStream(stream, expected){
return testUtil.stream.read(stream).then(function(data){
data.should.eql(expected);
