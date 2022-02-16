var should = require('chai').should();
var sinon = require('sinon');
var Promise = require('bluebird');

describe('Tag', () => {
var Tag = require('../../../lib/extend/tag');
var tag = new Tag();

it('register()', () => {
var tag = new Tag();
