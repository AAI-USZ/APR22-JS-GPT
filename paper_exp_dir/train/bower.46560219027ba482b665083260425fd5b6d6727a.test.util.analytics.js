var expect = require('expect.js');
var proxyquire = require('proxyquire');
var object = require('mout').object;

describe('analytics', function () {

var mockAnalytics = function(stubs, promptResponse) {
return proxyquire('../../lib/util/analytics', {
insight: function () {
return object.merge(stubs || {}, {
askPermission: function (message, callback) {
callback(undefined, promptResponse);
}
});
}
});
};

describe('#setup', function () {
it('leaves analytics enabled if provided', function () {
return mockAnalytics()
.setup({ analytics: true })
.then(function (enabled) {
expect(enabled).to.be(true);
});
});

it('leaves analytics disabled if provided', function () {
return mockAnalytics()
.setup({ analytics: false })
.then(function (enabled) {
expect(enabled).to.be(false);
});
});

it('disables analytics for non-interactive mode', function () {
