'use strict';

var should = require('chai').should();
var Promise = require('bluebird');

describe('page', function(){
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(__dirname, {silent: true});
var Page = hexo.model('Page');
var generator = Promise.method(require('../../../lib/plugins/generator/page').bind(hexo));

function locals(){
hexo.locals.invalidate();
return hexo.locals.toObject();
}

it('default layout', function(){
return Page.insert({
source: 'foo',
path: 'bar'
}).then(function(page){
