var expect = require('expect.js');
var helpers = require('../helpers');

var lookup = helpers.command('lookup');

describe('bower lookup', function () {

var lookupWithResult = function (response) {
return helpers.command('lookup', {
'bower-registry-client': function() {
return {
lookup: function(query, callback) {
if (query in response) {
callback(null, response[query]);
