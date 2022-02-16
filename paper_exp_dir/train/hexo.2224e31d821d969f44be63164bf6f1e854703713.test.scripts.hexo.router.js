'use strict';

const Promise = require('bluebird');
const { Readable } = require('stream');
const { join } = require('path');
const crypto = require('crypto');
const { createReadStream } = require('hexo-fs');
const { spy, assert: sinonAssert } = require('sinon');
const testUtil = require('../../util');

describe('Router', () => {
const Router = require('../../../lib/hexo/router');
const router = new Router();

function checkStream(stream, expected) {
return testUtil.stream.read(stream).then(data => {
data.should.eql(expected);
});
}

function checksum(stream) {
return new Promise((resolve, reject) => {
const hash = crypto.createHash('sha1');

stream.on('readable', () => {
let chunk;

while ((chunk = stream.read()) !== null) {
hash.update(chunk);
}
}).on('end', () => {
resolve(hash.digest('hex'));
}).on('error', reject);
});
}

it('format()', () => {
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

it('format() - path must be a string', () => {
should.throw(() => router.format(() => {}), 'path must be a string!');
});

it('set() - string', () => {
const listener = spy();

router.once('update', listener);

router.set('test', 'foo');
const data = router.get('test');

data.modified.should.be.true;
listener.calledOnce.should.be.true;
sinonAssert.calledWith(listener, 'test');
