'use strict';

var should = require('chai').should();
var Promise = require('bluebird');
var Readable = require('stream').Readable;
var pathFn = require('path');
var crypto = require('crypto');
var fs = require('hexo-fs');
var sinon = require('sinon');
var testUtil = require('../../util');

describe('Router', function(){
var Router = require('../../../lib/hexo/router');
var router = new Router();

function checkStream(stream, expected){
return testUtil.stream.read(stream).then(function(data){
data.should.eql(expected);
});
}

function checksum(stream){
return new Promise(function(resolve, reject){
var hash = crypto.createHash('sha1');

stream.on('readable', function(){
var chunk;

while ((chunk = stream.read()) !== null){
hash.update(chunk);
}
}).on('end', function(){
resolve(hash.digest('hex'));
}).on('error', reject);
});
}

it('format()', function(){
router.format('foo').should.eql('foo');


router.format('/foo').should.eql('foo');
router.format('///foo').should.eql('foo');


router.format('foo/').should.eql('foo/index.html');


router.format('').should.eql('index.html');
router.format().should.eql('index.html');


router.format('foo\\bar').should.eql('foo/bar');
router.format('foo\\bar\\').should.eql('foo/bar/index.html');


router.format('foo?a=1&b=2').should.eql('foo');
});

it('format() - path must be a string', function(){
var errorCallback = sinon.spy(function(err) {
err.should.have.property('message', 'path must be a string!');
})

try {
router.format(function(){});
} catch (err){
errorCallback(err);
}

