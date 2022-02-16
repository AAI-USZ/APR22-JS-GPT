'use strict';

const { Schema } = require('warehouse');
const Promise = require('bluebird');

module.exports = ctx => {
const Cache = new Schema({
_id: {type: String, required: true},
hash: {type: String, default: ''},
modified: {type: Number, default: Date.now() }
});

Cache.static('compareFile', function(id, hashFn, statFn) {
const cache = this.findById(id);



if (!cache) {
return Promise.all([hashFn(id), statFn(id)]).spread((hash, stats) => this.insert({
_id: id,
hash,
modified: stats.mtime.getTime()
})).thenReturn({
type: 'create'
});
}

let mtime;


return statFn(id).then(stats => {
mtime = stats.mtime.getTime();


if (cache.modified === mtime) {
return {
type: 'skip'
};
}


return hashFn(id);
}).then(result => {


if (typeof result === 'object') return result;

const hash = result;


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
