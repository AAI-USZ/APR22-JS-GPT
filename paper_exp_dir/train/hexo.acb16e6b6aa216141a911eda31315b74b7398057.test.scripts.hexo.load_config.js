const should = require('chai').should();
const pathFn = require('path');
const fs = require('hexo-fs');
const _ = require('lodash');

describe('Load config', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(pathFn.join(__dirname, 'config_test'), {silent: true});
const loadConfig = require('../../../lib/hexo/load_config');
const defaultConfig = require('../../../lib/hexo/default_config');

hexo.env.init = true;

before(() => fs.mkdirs(hexo.base_dir).then(() => hexo.init()));

after(() => fs.rmdir(hexo.base_dir));

beforeEach(() => {
hexo.config = _.cloneDeep(defaultConfig);
});

it('config file does not exist', () => loadConfig(hexo).then(() => {
hexo.config.should.eql(defaultConfig);
}));

it('_config.yml exists', () => {
const configPath = pathFn.join(hexo.base_dir, '_config.yml');

return fs.writeFile(configPath, 'foo: 1').then(() => loadConfig(hexo)).then(() => {
hexo.config.foo.should.eql(1);
}).finally(() => fs.unlink(configPath));
});

it('_config.json exists', () => {
const configPath = pathFn.join(hexo.base_dir, '_config.json');
