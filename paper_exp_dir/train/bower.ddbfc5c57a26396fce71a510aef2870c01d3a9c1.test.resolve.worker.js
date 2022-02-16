var expect = require('expect.js');
var Q = require('Q');
var Worker = require('../../lib/resolve/Worker');

describe('Worker', function () {
var timeout;

afterEach(function () {
if (timeout) {
clearTimeout(timeout);
timeout = null;
}
});

describe('.enqueue', function () {
it('return a promise', function () {
var worker = new Worker(),
promise;

promise = worker.enqueue(function () { return Q.resolve('foo'); });

expect(promise).to.be.an('object');
expect(promise.then).to.be.a('function');
});

it('should call the function and resolve', function (next) {
var worker = new Worker();

worker.enqueue(function () { return Q.resolve('foo'); })
.then(function (ret) {
