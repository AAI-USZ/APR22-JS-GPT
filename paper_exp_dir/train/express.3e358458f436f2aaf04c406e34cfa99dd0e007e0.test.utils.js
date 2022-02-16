
var utils = require('../lib/utils')
, assert = require('assert');

describe('utils.etag(body, encoding)', function(){
it('should support strings', function(){
utils.etag('express!')
.should.eql('W/"8-3098196679"')
})

it('should support utf8 strings', function(){
utils.etag('express❤', 'utf8')
.should.eql('W/"a-1751845617"')
})
