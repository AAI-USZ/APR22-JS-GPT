'use strict';

var should = require('chai').should();

var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(__dirname);

var ctx = {
render: require('../../../lib/plugins/helper/render')(hexo)
};

var markdown = require('../../../lib/plugins/helper/markdown').bind(ctx);

