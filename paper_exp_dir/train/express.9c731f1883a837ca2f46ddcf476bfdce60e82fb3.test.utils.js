
var utils = require('../lib/utils')
, assert = require('assert');

describe('utils.etag(body, encoding)', function(){
it('should support strings', function(){
utils.etag('express!')
.should.eql('"zZdv4imtWD49AHEviejT6A=="')
})

it('should support utf8 strings', function(){
utils.etag('express❤', 'utf8')
.should.eql('"fsFba4IxwQS6h6Umb+FNxw=="')
})

