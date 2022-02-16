var Cache = require('../../../lib/util/Cache'),
expect = require('chai').expect;

describe('Cache', function () {

beforeEach(function () {
this.cache = new Cache();
});

describe('Constructor', function () {

describe('instantiating cache', function () {

it('should provide an instance of RegistryClient', function () {
expect(this.cache instanceof Cache).to.be.ok;
});

it('should inherit LRU cache methods', function () {
var self = this,
lruMethods = [
'max', 'lengthCalculator', 'length', 'itemCount', 'forEach',
'keys', 'values', 'reset', 'dump', 'dumpLru', 'set', 'has',
'get', 'peek', 'del'
];

lruMethods.forEach(function (method) {
expect(self.cache._cache).to.have.ownProperty(method);
