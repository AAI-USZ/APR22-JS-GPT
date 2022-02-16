'use strict';

var isDefiningProjection = require('./isDefiningProjection');



module.exports = function isInclusive(projection) {
if (projection == null) {
return false;
}

var props = Object.keys(projection);
var numProps = props.length;
if (numProps === 0) {
return false;
}

for (var i = 0; i < numProps; ++i) {
var prop = props[i];


if (isDefiningProjection(projection[prop]) && !!projection[prop]) {
return true;
}
}

return false;
};
