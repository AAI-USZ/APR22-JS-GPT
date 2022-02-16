'use strict';

var should = require('chai').should();
var util = require('hexo-util');
var _ = require('lodash');
var highlight = util.highlight;
var defaultConfig = require('../../../lib/hexo/default_config');

describe('Backtick code block', function(){
var Hexo = require('../../../lib/hexo');
