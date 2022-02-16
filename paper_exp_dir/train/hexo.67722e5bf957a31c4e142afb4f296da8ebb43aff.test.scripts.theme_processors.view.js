var should = require('chai').should();
var pathFn = require('path');
var fs = require('hexo-fs');
var Promise = require('bluebird');

describe('view', () => {
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(pathFn.join(__dirname, 'view_test'), {silent: true});
var processor = require('../../../lib/theme/processors/view');
var process = Promise.method(processor.process.bind(hexo));
