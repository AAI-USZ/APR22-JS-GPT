var expect = require('expect.js');
var template = require('../../lib/util/template');
var fs = require('fs');

describe('template: util template methods for templates in lib/templates', function() {
describe('.render() - Renders a handlebars template', function() {
var testTemplateName = 'test-template.tpl';
var testTemplatePath =
__dirname + '/../../lib/templates/' + testTemplateName;
beforeEach(function() {
fs.writeFileSync(testTemplatePath, '{{foo}}');
console.log();
});
it('.render() returns a compiled test-template template', function() {
var compiledStr = template.render(testTemplateName, {
