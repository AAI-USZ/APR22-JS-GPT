var pathFn = require('path');
var should = require('chai').should();
var fs = require('hexo-fs');
var highlight = require('hexo-util').highlight;

describe('include_code', function(){
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(pathFn.join(__dirname, 'include_code_test'));
var includeCode = require('../../../lib/plugins/tag/include_code')(hexo);
var path = pathFn.join(hexo.source_dir, hexo.config.code_dir, 'test.js');
