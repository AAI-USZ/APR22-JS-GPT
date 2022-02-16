var should = require('chai').should();
var util = require('hexo-util');
var _ = require('lodash');
var defaultConfig = require('../../../lib/hexo/default_config');

describe('Backtick code block', () => {
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo();
var codeBlock = require('../../../lib/plugins/filter/before_post_render/backtick_code_block').bind(hexo);

