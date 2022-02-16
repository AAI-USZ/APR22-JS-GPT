var should = require('chai').should();

describe('blockquote', () => {
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(__dirname);
var blockquote = require('../../../lib/plugins/tag/blockquote')(hexo);

before(() => hexo.init().then(() => hexo.loadPlugin(require.resolve('hexo-renderer-marked'))));

var bq = (args, content) => blockquote(args.split(' '), content || '');

it('default', () => {
