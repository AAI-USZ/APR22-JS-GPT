var should = require('chai').should();
var sinon = require('sinon');

describe('Cache', () => {
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo();
var Cache = hexo.model('Cache');

it('_id - required', () => {
var errorCallback = sinon.spy(err => {
