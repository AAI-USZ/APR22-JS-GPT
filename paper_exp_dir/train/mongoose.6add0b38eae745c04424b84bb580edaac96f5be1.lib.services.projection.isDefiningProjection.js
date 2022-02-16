'use strict';



module.exports = function isDefiningProjection(val) {
if (val == null) {

return true;
}
if (typeof val === 'object') {


return !('$meta' in val) && !('$slice' in val);
}
return true;
};
