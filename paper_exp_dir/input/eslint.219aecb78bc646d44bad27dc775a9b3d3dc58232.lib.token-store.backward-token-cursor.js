
"use strict";





const Cursor = require("./cursor");
const utils = require("./utils");






module.exports = class BackwardTokenCursor extends Cursor {


constructor(tokens, comments, indexMap, startLoc, endLoc) {
super();
this.tokens = tokens;
this.index = utils.getLastIndex(tokens, indexMap, endLoc);
this.indexEnd = utils.getFirstIndex(tokens, indexMap, startLoc);
}


moveNext() {
if (this.index >= this.indexEnd) {
this.current = this.tokens[this.index];
this.index -= 1;
return true;
}
return false;
}




getOneToken() {
return (this.index >= this.indexEnd) ? this.tokens[this.index] : null;
}
};
