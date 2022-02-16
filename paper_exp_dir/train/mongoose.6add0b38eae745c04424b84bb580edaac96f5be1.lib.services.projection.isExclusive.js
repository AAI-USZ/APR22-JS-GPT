'use strict';

const isDefiningProjection = require('./isDefiningProjection');



module.exports = function isExclusive(projection) {
let keys = Object.keys(projection);
let ki = keys.length;
let exclude = null;

if (ki === 1 && keys[0] === '_id') {
exclude = !!projection[keys[ki]];
} else {
while (ki--) {


if (keys[ki] !== '_id' && isDefiningProjection(projection[keys[ki]])) {
exclude = !projection[keys[ki]];
break;
}
}
}

return exclude;
};
