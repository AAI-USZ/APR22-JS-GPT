
"use strict";


module.exports = function isEmojiModifier(code) {
return code >= 0x1F3FB && code <= 0x1F3FF;
};
