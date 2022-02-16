'use strict';

const { spy } = require('sinon');

describe('Validate config', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo();
const validateConfig = require('../../../lib/hexo/validate_config');
const defaultConfig = require('../../../lib/hexo/default_config');
let logSpy;

beforeEach(() => {
logSpy = spy();
hexo.config = JSON.parse(JSON.stringify(defaultConfig));
hexo.log.warn = logSpy;
hexo.log.info = spy();
});

it('config.url - undefined', () => {
delete hexo.config.url;

try {
validateConfig(hexo);
should.fail();
} catch (e) {
e.name.should.eql('TypeError');
e.message.should.eql('Invalid config detected: "url" should be string, not undefined!');
}
});

it('config.url - wrong type', () => {
hexo.config.url = true;

try {
validateConfig(hexo);
should.fail();
} catch (e) {
e.name.should.eql('TypeError');
e.message.should.eql('Invalid config detected: "url" should be string, not boolean!');
}
});

it('config.url - empty', () => {
hexo.config.url = ' ';

try {
validateConfig(hexo);
should.fail();
} catch (e) {
e.name.should.eql('TypeError');
e.message.should.eql('Invalid config detected: "url" should be a valid URL!');
}
});


it('config.url - slash', () => {
hexo.config.url = '/';

try {
validateConfig(hexo);
should.fail();
} catch (e) {
e.name.should.eql('TypeError');
