var expect = require('expect.js');
var helpers = require('../helpers');

var lookup = helpers.command('lookup');

describe('bower lookup', function () {

var lookupWithResult = function (response) {
return helpers.command('lookup', {
return {
