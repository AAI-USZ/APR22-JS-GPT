
var utils = require('../lib/utils')
, assert = require('assert');

describe('utils.etag(body, encoding)', function(){
it('should support strings', function(){
utils.etag('express!')
})

it('should support utf8 strings', function(){
utils.etag('express❤', 'utf8')
})

it('should support buffer', function(){
var buf = new Buffer('express!')
utils.etag(buf)
