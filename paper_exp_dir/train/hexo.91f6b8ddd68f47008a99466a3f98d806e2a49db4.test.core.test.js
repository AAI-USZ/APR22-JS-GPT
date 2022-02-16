var path = require('path'),
should = require('chai').should();

describe('Core', function(){
var testDir = path.dirname(__dirname),
baseDir = path.join(testDir, 'blog') + path.sep,
coreDir = path.dirname(testDir) + path.sep;

it('core_dir', function(){
hexo.core_dir.should.eql(coreDir);
});

it('lib_dir', function(){
hexo.lib_dir.should.eql(path.join(coreDir, 'lib') + path.sep);
