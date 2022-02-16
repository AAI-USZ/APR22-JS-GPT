var expect = require('expect.js');
var mout = require('mout');
var endpointParser = require('../');

describe('endpoint-parser', function () {
describe('.decompose', function () {
it('should decompose endpoints correctly', function () {
var suite = {
'jquery#~2.0.0': { name: '', source: 'jquery', target: '~2.0.0' },
'jquery#*': { name: '', source: 'jquery', target: '*' },
'jquery#latest': { name: '', source: 'jquery', target: '*' },
'jquery#3dc50c62fe2d2d01afc58e7ad42236a35acff4d8': { name: '', source: 'jquery', target: '3dc50c62fe2d2d01afc58e7ad42236a35acff4d8' },
'jquery#master': { name: '', source: 'jquery', target: 'master' },
'backbone=backbone-amd#~1.0.0': { name: 'backbone', source: 'backbone-amd', target: '~1.0.0' },
'backbone=backbone-amd#latest': { name: 'backbone', source: 'backbone-amd', target: '*' },
'backbone=backbone-amd#*': { name: 'backbone', source: 'backbone-amd', target: '*' },
'http://twitter.github.io/bootstrap/assets/bootstrap.zip': { name: '', source: 'http://twitter.github.io/bootstrap/assets/bootstrap.zip', target: '*' },
'bootstrap=http://twitter.github.io/bootstrap/assets/bootstrap.zip': { name: 'bootstrap', source: 'http://twitter.github.io/bootstrap/assets/bootstrap.zip', target: '*' },
'bootstrap=http://twitter.github.io/bootstrap/assets/bootstrap.zip#latest': { name: 'bootstrap', source: 'http://twitter.github.io/bootstrap/assets/bootstrap.zip', target: '*' }
};

mout.object.forOwn(suite, function (decEndpoint, endpoint) {
expect(endpointParser.decompose(endpoint)).to.eql(decEndpoint);
});
});

it('should trim sources and targets', function () {
var decEndpoint = endpointParser.decompose('foo= source # ~1.0.2 ');
expect(decEndpoint.source).to.equal('source');
expect(decEndpoint.target).to.equal('~1.0.2');

decEndpoint = endpointParser.decompose('foo= source # latest');
expect(decEndpoint.source).to.equal('source');
expect(decEndpoint.target).to.equal('*');

decEndpoint = endpointParser.decompose('foo= source # *');
expect(decEndpoint.source).to.equal('source');
expect(decEndpoint.target).to.equal('*');
});
});
