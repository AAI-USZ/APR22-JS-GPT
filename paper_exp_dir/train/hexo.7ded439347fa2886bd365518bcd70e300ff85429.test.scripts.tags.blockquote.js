'use strict';

require('chai').should();

describe('blockquote', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(__dirname);
const blockquote = require('../../../lib/plugins/tag/blockquote')(hexo);

before(() => hexo.init().then(() => hexo.loadPlugin(require.resolve('hexo-renderer-marked'))));

const bq = (args, content) => blockquote(args.split(' '), content || '');

