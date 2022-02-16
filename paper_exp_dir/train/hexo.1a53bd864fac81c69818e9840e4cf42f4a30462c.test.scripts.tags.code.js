'use strict';

var should = require('chai').should();
var util = require('hexo-util');
var cheerio = require('cheerio');

describe('code', function() {
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo();
var codeTag = require('../../../lib/plugins/tag/code')(hexo);

var fixture = [
'if (tired && night){',
'  sleep();',
