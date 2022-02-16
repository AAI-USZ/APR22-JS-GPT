
"use strict";


module.exports = function isRegionalIndicatorSymbol(code) {
return code >= 0x1F1E6 && code <= 0x1F1FF;
};
