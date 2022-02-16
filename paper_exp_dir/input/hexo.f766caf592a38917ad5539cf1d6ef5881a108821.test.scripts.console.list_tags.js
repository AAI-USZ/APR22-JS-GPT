'use strict';

const Promise = require('bluebird');

describe('Console list', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(__dirname);
const Post = hexo.model('Post');

const listTags = require('../../../lib/plugins/console/list/tag').bind(hexo);

hexo.config.permalink = ':title/';

let logStub;

before(() => { logStub = stub(console, 'log'); });

afterEach(() => { logStub.reset(); });

after(() => { logStub.restore(); });

it('no tags', () => {
listTags();
