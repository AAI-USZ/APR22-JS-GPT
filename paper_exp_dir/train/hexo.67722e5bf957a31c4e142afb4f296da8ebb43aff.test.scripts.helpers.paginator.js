var should = require('chai').should();

describe('paginator', () => {
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(__dirname);

var ctx = {
page: {
base: '',
total: 10
},
