var should = require('chai').should();

describe('blockquote', function(){
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(__dirname);
var blockquote = require('../../../lib/plugins/tag/blockquote')(hexo);

before(function(){
return hexo.init().then(function(){
return hexo.loadPlugin(require.resolve('hexo-renderer-marked'));
