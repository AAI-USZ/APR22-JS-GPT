var should = require('chai').should();
var pathFn = require('path');
var sep = pathFn.sep;

describe('Hexo', function(){
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(__dirname);
var coreDir = pathFn.join(__dirname, '../../..');
var version = require('../../../package.json').version;
var Post = hexo.model('Post');

hexo.extend.console.register('test', function(args){
return args;
});

it('constructor', function(){
hexo.core_dir.should.eql(coreDir + sep);
hexo.lib_dir.should.eql(pathFn.join(coreDir, 'lib') + sep);
hexo.version.should.eql(version);
