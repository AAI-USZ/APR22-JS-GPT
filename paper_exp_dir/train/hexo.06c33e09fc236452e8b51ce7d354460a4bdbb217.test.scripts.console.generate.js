'use strict';

var should = require('chai').should();
var pathFn = require('path');
var fs = require('hexo-fs');
var Promise = require('bluebird');
var sinon = require('sinon');

describe('generate', function() {
var Hexo = require('../../../lib/hexo');
var generateConsole = require('../../../lib/plugins/console/generate');
var hexo, generate;

beforeEach(function() {
hexo = new Hexo(pathFn.join(__dirname, 'generate_test'), {silent: true});
generate = generateConsole.bind(hexo);

return fs.mkdirs(hexo.base_dir).then(function() {
return hexo.init();
});
});
