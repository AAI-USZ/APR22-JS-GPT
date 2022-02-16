'use strict';

describe('markdown', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(__dirname);

const ctx = {
render: require('../../../lib/plugins/helper/render')(hexo)
};

const markdown = require('../../../lib/plugins/helper/markdown').bind(ctx);

before(() => hexo.init().then(() => hexo.loadPlugin(require.resolve('hexo-renderer-marked'))));
