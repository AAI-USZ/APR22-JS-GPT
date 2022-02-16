'use strict';

var should = require('chai').should();
var pathFn = require('path');
var fs = require('hexo-fs');
var _ = require('lodash');

describe('Load config', function() {
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(pathFn.join(__dirname, 'config_test'), {silent: true});
var loadConfig = require('../../../lib/hexo/load_config');
var defaultConfig = require('../../../lib/hexo/default_config');

hexo.env.init = true;

function reset() {
hexo.config = _.clone(defaultConfig);
}

before(function() {
return fs.mkdirs(hexo.base_dir).then(function() {
return hexo.init();
});
});

after(function() {
return fs.rmdir(hexo.base_dir);
});

it('config file does not exist', function() {
return loadConfig(hexo).then(function() {
hexo.config.should.eql(defaultConfig);
});
});

it('_config.yml exists', function() {
var configPath = pathFn.join(hexo.base_dir, '_config.yml');

return fs.writeFile(configPath, 'foo: 1').then(function() {
return loadConfig(hexo);
}).then(function() {
