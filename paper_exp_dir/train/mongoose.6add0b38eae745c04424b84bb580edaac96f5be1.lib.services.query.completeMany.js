'use strict';

const helpers = require('../../queryhelpers');

module.exports = completeMany;



function completeMany(model, docs, fields, userProvidedFields, opts, callback) {
const arr = [];
let count = docs.length;
const len = count;
let error = null;

function init(_error) {
if (_error != null) {
error = error || _error;
}
if (error != null) {
--count || process.nextTick(() => callback(error));
return;
}
--count || process.nextTick(() => callback(error, arr));
}

for (let i = 0; i < len; ++i) {
arr[i] = helpers.createModel(model, docs[i], fields, userProvidedFields);
try {
arr[i].init(docs[i], opts, init);
} catch (error) {
init(error);
}
arr[i].$session(opts.session);
}
}
