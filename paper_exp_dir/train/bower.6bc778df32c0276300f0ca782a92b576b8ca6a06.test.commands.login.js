var expect = require('expect.js');
var helpers = require('../helpers');

var fakeGitHub = function(authenticate) {
function FakeGitHub() {}

var _creds;

FakeGitHub.prototype.authenticate = function(creds) {
_creds = creds;
};

FakeGitHub.prototype.authorization = {
create: function(options, cb) {
if (_creds.password === 'validpassword') {
cb(null, { token: 'faketoken' });
} else if (_creds.password === 'withtwofactor') {
if (
options.headers &&
options.headers['X-GitHub-OTP'] === '123456'
) {
cb(null, { token: 'faketwoauthtoken' });
} else {
cb({
