

var assert   = require('assert');
var rimraf   = require('rimraf');

var Manager  = require('../lib/core/manager');
var list     = require('../lib/commands/list');
var config   = require('../lib/core/config');

describe('list', function () {
var savedConfigJson = config.json;

function clean(done) {
var del = 0;


config.json = savedConfigJson;

rimraf(config.directory, function () {

if (++del >= 2) done();
});

rimraf(config.cache, function () {

if (++del >= 2) done();
});
}


function normalize(target) {
var key,
newObj;

if (typeof target === 'string') {
return target.replace(/\\/g, '/');
}

if (Array.isArray(target)) {
return target.map(function (item) {
