
var assert  = require('assert');
var init    = require('../lib/commands/init');

var cwd = process.cwd();

var setPackage = function (name) {
return function () {
cwd = process.cwd();
process.chdir(__dirname + '/assets/' + name);
};
};

var restorecwd = function () {
process.chdir(cwd);
};

describe('init', function () {
var savedData;

init.Init.prototype.save = function (data) {
savedData = data;
};

describe('defaults', function () {
before(setPackage('package-new'));
after(restorecwd);

it('Should ask you five questions and output default answers', function (next) {
var counter = 0;

var questions = [
'name: [package-new]',
'version: [0.0.0]',
'main file: [index.js]',
'add commonly ignored files to ignore list? (y/n): [y]'
];

init()
.on('prompt', function (prompt) {
assert.strictEqual(prompt, questions[counter++]);
process.stdin.emit('data', '\n');
})
.on('end', function () {
assert.strictEqual(counter, 4);
