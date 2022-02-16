'use strict';

var should = require('chai').should();
var moment = require('moment');

var PERMALINK = ':year/:month/:day/:title/';

describe('post_permalink', function(){
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo();
var postPermalink = require('../../../lib/plugins/filter/post_permalink').bind(hexo);
