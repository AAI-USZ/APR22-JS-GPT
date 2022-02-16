'use strict';

const _modifiedPaths = require('../common').modifiedPaths;



module.exports = function modifiedPaths(update) {
const keys = Object.keys(update);
const hasDollarKey = keys.filter(key => key.startsWith('$')).length > 0;

const res = {};
if (hasDollarKey) {
for (const key of keys) {
_modifiedPaths(update[key], '', res);
}
} else {
_modifiedPaths(update, '', res);
}

return res;
};
