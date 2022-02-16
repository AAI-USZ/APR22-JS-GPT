'use strict';

const { stub, match } = require('sinon');
const { expect } = require('chai');

describe('Console list', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(__dirname);
const Post = hexo.model('Post');

const listPosts = require('../../../lib/plugins/console/list/post').bind(hexo);

let logStub;

before(() => { logStub = stub(console, 'log'); });

afterEach(() => { logStub.reset(); });

after(() => { logStub.restore(); });

it('no post', () => {
listPosts();
expect(logStub.calledWith(match('Date'))).be.true;
expect(logStub.calledWith(match('Title'))).be.true;
expect(logStub.calledWith(match('Path'))).be.true;
expect(logStub.calledWith(match('Category'))).be.true;
