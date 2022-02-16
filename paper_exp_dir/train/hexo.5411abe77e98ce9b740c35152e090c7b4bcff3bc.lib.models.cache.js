'use strict';

var Schema = require('warehouse').Schema;
var Promise = require('bluebird');

module.exports = function(ctx) {
var Cache = new Schema({
_id: {type: String, required: true},
hash: {type: String, default: ''},
modified: {type: Number, default: Date.now}
});

Cache.static('compareFile', function(id, hashFn, statFn) {
var cache = this.findById(id);
var self = this;
var mtime;



if (!cache) {
return Promise.all([hashFn(id), statFn(id)]).spread(function(hash, stats) {
return self.insert({
_id: id,
hash: hash,
modified: stats.mtime
});
}).thenReturn({
type: 'create'
});
}


return statFn(id).then(function(stats) {
mtime = stats.mtime;


if (cache.modified === mtime) {
return {
type: 'skip'
};
}


return hashFn(id);
}).then(function(result) {


if (typeof result === 'object') return result;

var hash = result;


if (cache.hash === hash) {
return {
type: 'skip'
};
}


cache.hash = hash;
cache.modified = mtime;

return cache.save().thenReturn({
type: 'update'
});
});
});

return Cache;
};
