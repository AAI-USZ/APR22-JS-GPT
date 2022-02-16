
"use strict";


module.exports = function isSurrogatePair(lead, tail) {
return lead >= 0xD800 && lead < 0xDC00 && tail >= 0xDC00 && tail < 0xE000;
};
