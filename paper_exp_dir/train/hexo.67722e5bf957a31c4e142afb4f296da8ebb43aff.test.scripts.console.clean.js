var should = require('chai').should();
var fs = require('hexo-fs');

describe('clean', () => {
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(__dirname, {silent: true});
var clean = require('../../../lib/plugins/console/clean').bind(hexo);

it('delete database', () => {
var dbPath = hexo.database.options.path;
