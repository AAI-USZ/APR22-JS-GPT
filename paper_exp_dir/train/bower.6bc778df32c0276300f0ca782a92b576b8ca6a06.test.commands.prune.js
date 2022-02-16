var expect = require('expect.js');
var helpers = require('../helpers');

var prune = helpers.command('prune');

describe('bower home', function() {
var mainPackage = new helpers.TempDir({
'bower.json': {
name: 'package',
dependencies: {
jquery: '*'
}
},
'bower_components/jquery/jquery.js': 'jquery source'
});
