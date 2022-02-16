'use strict';

const { exists, mkdirs, readFile, rmdir, writeFile } = require('hexo-fs');
const { join } = require('path');
const { spy, stub, match } = require('sinon');

describe('deploy', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(join(__dirname, 'deploy_test'), { silent: true });
const deploy = require('../../../lib/plugins/console/deploy').bind(hexo);

before(async () => {
await mkdirs(hexo.public_dir);
hexo.init();
});

beforeEach(() => {
hexo.config.deploy = { type: 'foo' };
hexo.extend.deployer.register('foo', () => {});
});

after(() => rmdir(hexo.base_dir));

it('no deploy config', () => {
delete hexo.config.deploy;

const _stub = stub(console, 'log');

try {
should.not.exist(deploy({ test: true }));
_stub.calledWith(match('You should configure deployment settings in _config.yml first!')).should.eql(true);
} finally {
_stub.restore();
}
});
