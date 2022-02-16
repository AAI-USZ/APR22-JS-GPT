var path = require('path'),
should = require('chai').should();

describe('Core', function(){
var baseDir = path.join(__dirname, 'blog') + path.sep,
coreDir = path.dirname(__dirname) + path.sep;

it('core_dir', function(){
hexo.core_dir.should.eql(coreDir);
});

