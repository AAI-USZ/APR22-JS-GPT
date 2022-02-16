var should = require('chai').should();
var pathFn = require('path');
var fs = require('hexo-fs');
var Promise = require('bluebird');

describe('i18n', () => {
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(pathFn.join(__dirname, 'config_test'), {silent: true});
var processor = require('../../../lib/theme/processors/i18n');
var process = Promise.method(processor.process.bind(hexo));
