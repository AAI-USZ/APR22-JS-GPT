var should = require('chai').should();

describe('paginator', function(){
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(__dirname);

var ctx = {
page: {
base: ''
},
total: 10,
site: hexo.locals,
config: hexo.config
};

