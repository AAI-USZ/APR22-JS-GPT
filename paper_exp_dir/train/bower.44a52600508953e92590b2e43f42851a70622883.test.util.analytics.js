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
},
config: {
clear: function () {}
}
});
}
});
};

describe('#setup', function () {
