var expect = require('chai').expect;
var helpers = require('../helpers');
var multiline = require('multiline').stripIndent;

var JsonRenderer = helpers.require('lib/renderers/JsonRenderer');

var jsonRendererWithPrompt = function (stubs) {
return helpers.require('lib/renderers/JsonRenderer', {
promptly: stubs
});
};


var normalize = function (string) {
return string.replace(/\r\n|\r/g, '\n');
};

describe('JsonRenderer', function () {

it('logs simple message to stderr', function () {
return helpers.capture(function() {
var renderer = new JsonRenderer();
