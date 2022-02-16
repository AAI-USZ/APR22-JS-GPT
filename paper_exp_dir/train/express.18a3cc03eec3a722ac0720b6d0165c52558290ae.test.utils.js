
var utils = require('../lib/utils')
, assert = require('assert');

describe('utils.etag(body)', function(){

var str = 'Hello CRC';
var strUTF8 = '<!DOCTYPE html>\n<html>\n<head>\n</head>\n<body><p>自動販売</p></body></html>';

it('should support strings', function(){
utils.etag(str).should.eql('"-2034458343"');
})

it('should support utf8 strings', function(){
