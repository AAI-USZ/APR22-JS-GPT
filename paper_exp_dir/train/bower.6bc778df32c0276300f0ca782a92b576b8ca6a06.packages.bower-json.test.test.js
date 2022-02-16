var path = require('path');
var expect = require('expect.js');
var _s = require('underscore.string');
var bowerJson = require('../lib/json');
var request = require('request');

describe('.find', function() {
it('should find the bower.json file', function(done) {
bowerJson.find(__dirname + '/pkg-bower-json', function(err, file) {
if (err) {
return done(err);
}

expect(file).to.equal(
path.resolve(__dirname + '/pkg-bower-json/bower.json')
);
done();
});
});

