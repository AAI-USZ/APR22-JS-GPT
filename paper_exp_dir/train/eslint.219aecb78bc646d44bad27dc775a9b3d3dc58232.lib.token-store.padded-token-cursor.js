
"use strict";





const ForwardTokenCursor = require("./forward-token-cursor");






module.exports = class PaddedTokenCursor extends ForwardTokenCursor {


constructor(tokens, comments, indexMap, startLoc, endLoc, beforeCount, afterCount) {
super(tokens, comments, indexMap, startLoc, endLoc);
this.index = Math.max(0, this.index - beforeCount);
this.indexEnd = Math.min(tokens.length - 1, this.indexEnd + afterCount);
}
};
