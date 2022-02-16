
var assert = require('assert');
var Buffer = require('safe-buffer').Buffer
var utils = require('../lib/utils');

describe('utils.etag(body, encoding)', function(){
it('should support strings', function(){
utils.etag('express!')
.should.eql('"8-O2uVAFaQ1rZvlKLT14RnuvjPIdg"')
})

it('should support utf8 strings', function(){
