var Q = require('q');
var expect = require('expect.js');
var helpers = require('../helpers');

var search = helpers.command('search');

describe('bower search', function () {

it('correctly reads arguments', function () {
expect(search.readOptions(['jquery']))
.to.eql(['jquery']);
});

it('searches for single repository', function () {
return Q.Promise(function (resolve) {
var search = helpers.command('search', {
'../core/PackageRepository': function () {
return {
getRegistryClient: function () {
return {
search: resolve
};
}
}
}
});

