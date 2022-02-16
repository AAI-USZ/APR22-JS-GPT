
"use strict";





const Cursor = require("./cursor");
const utils = require("./utils");






module.exports = class ForwardTokenCursor extends Cursor {


constructor(tokens, comments, indexMap, startLoc, endLoc) {
super();
this.tokens = tokens;
this.index = utils.getFirstIndex(tokens, indexMap, startLoc);
this.indexEnd = utils.getLastIndex(tokens, indexMap, endLoc);
}


moveNext() {
if (this.index <= this.indexEnd) {
this.current = this.tokens[this.index];
this.index += 1;
return true;
}
return false;
}




getOneToken() {
return (this.index <= this.indexEnd) ? this.tokens[this.index] : null;
}


getAllTokens() {
return this.tokens.slice(this.index, this.indexEnd + 1);
}
};
