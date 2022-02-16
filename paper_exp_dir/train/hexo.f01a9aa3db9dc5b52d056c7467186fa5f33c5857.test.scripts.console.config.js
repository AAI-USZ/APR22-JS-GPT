'use strict';

var should = require('chai').should();
var fs = require('hexo-fs');
var pathFn = require('path');
var yaml = require('js-yaml');
var _ = require('lodash');

describe('config', function() {
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(pathFn.join(__dirname, 'config_test'), {silent: true});
var config = require('../../../lib/plugins/console/config').bind(hexo);

before(function() {
return fs.mkdirs(hexo.base_dir).then(function() {
return hexo.init();
});
});

beforeEach(function() {
return fs.writeFile(hexo.config_path, '');
});

after(function() {
return fs.rmdir(hexo.base_dir);
});

it('read all config');

it('read config');

function writeConfig() {
var args = _.toArray(arguments);

return config({_: args}).then(function() {
return fs.readFile(hexo.config_path);
}).then(function(content) {
return yaml.safeLoad(content);
});
}

it('write config', function() {
return writeConfig('title', 'My Blog').then(function(config) {
