'use strict';

var Schema = require('warehouse').Schema;
var Promise = require('bluebird');

module.exports = function(ctx) {
var Cache = new Schema({
_id: {type: String, required: true},
hash: {type: Number},
modified: {type: Number, default: Date.now}
});

Cache.static('compareFile', function(id, hashFn, statFn) {
