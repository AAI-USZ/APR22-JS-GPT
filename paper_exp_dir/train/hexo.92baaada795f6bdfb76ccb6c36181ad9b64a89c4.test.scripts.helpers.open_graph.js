'use strict';

var moment = require('moment');
var should = require('chai').should();

describe('open_graph', () => {
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo();
var openGraph = require('../../../lib/plugins/helper/open_graph');
var isPost = require('../../../lib/plugins/helper/is').post;
