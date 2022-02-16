var pathFn = require('path');
var should = require('chai').should();
var fs = require('hexo-fs');
var highlight = require('hexo-util').highlight;
var Promise = require('bluebird');

describe('include_code', () => {
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(pathFn.join(__dirname, 'include_code_test'));
var includeCode = Promise.method(require('../../../lib/plugins/tag/include_code')(hexo));
