'use strict';

const Schema = require('warehouse').Schema;
const Promise = require('bluebird');

module.exports = ctx => {
const Cache = new Schema({
_id: {type: String, required: true},
hash: {type: String, default: ''},
modified: {type: Number, default: Date.now}
});

Cache.static('compareFile', function(id, hashFn, statFn) {
const cache = this.findById(id);
let mtime;



if (!cache) {
return Promise.all([hashFn(id), statFn(id)]).spread((hash, stats) => this.insert({
_id: id,
hash,
modified: stats.mtime
})).thenReturn({
type: 'create'
});
