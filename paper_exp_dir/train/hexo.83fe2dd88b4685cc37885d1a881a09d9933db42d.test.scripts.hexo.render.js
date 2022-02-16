var Hexo = require('../../../lib/hexo');
var fs = require('hexo-fs');
var pathFn = require('path');
var Promise = require('bluebird');
var yaml = require('js-yaml');

describe('Render', function(){
var hexo = new Hexo(pathFn.join(__dirname, 'render_test'));

var body = [
'name:',
'  first: John',
'  last: Doe',
