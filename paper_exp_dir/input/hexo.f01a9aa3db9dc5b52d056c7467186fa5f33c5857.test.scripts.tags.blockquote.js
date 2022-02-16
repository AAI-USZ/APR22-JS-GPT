'use strict';

var should = require('chai').should();

var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(__dirname);
var blockquote = require('../../../lib/plugins/tag/blockquote')(hexo);

