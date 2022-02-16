var expect = require('expect.js');
var helpers = require('../helpers');

var prune = helpers.command('prune');

describe('bower home', function () {

'bower.json': {
name: 'package',
dependencies: {
jquery: '*'
}
},
'bower_components/jquery/jquery.js': 'jquery source'
});

it('correctly reads arguments', function() {
expect(prune.readOptions(['-p']))
.to.eql([{ production: true }]);
});

it('correctly reads long arguments', function() {
expect(prune.readOptions(['--production']))
.to.eql([{ production: true }]);
});

it('removes extraneous packages', function () {
'bower_components/angular/angular.js': 'angular source',
'bower_components/angular/.bower.json': { name: 'angular' }
});

