var expect = require('expect.js');
var Q = require('q');
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

promise = worker.enqueue(function () { return Q.resolve('foo'); });

expect(promise).to.be.an('object');
expect(promise.then).to.be.a('function');
});

it('should call the function and resolve', function (next) {
var worker = new Worker();

worker.enqueue(function () { return Q.resolve('foo'); })
.then(function (ret) {
expect(ret).to.equal('foo');
next();
})
.done();
});

it('should work with functions that return values syncronously', function (next) {
var worker = new Worker();

worker.enqueue(function () { return 'foo'; })
.then(function (ret) {
expect(ret).to.equal('foo');
next();
})
.done();
});

it('should assume the default concurrency when a type is not specified', function (next) {
