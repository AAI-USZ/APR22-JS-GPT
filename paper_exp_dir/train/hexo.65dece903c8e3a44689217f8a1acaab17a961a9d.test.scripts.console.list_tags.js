'use strict';

const Promise = require('bluebird');
const { stub, match } = require('sinon');
const { expect } = require('chai');

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
expect(logStub.calledWith(match('Name'))).be.true;
expect(logStub.calledWith(match('Posts'))).be.true;
expect(logStub.calledWith(match('Path'))).be.true;
expect(logStub.calledWith(match('No tags.'))).be.true;
