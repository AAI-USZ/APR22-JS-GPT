'use strict';

var should = require('chai').should();
var sinon = require('sinon');

describe('migrate', function(){
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(__dirname, {silent: true});
var migrate = require('../../../lib/plugins/console/migrate').bind(hexo);

