
"use strict";





const Cursor = require("./cursor");
const utils = require("./utils");






module.exports = class BackwardTokenCommentCursor extends Cursor {


constructor(tokens, comments, indexMap, startLoc, endLoc) {
super();
this.tokens = tokens;
this.comments = comments;
this.tokenIndex = utils.getLastIndex(tokens, indexMap, endLoc);
this.commentIndex = utils.search(comments, endLoc) - 1;
this.border = startLoc;
}


moveNext() {
const token = (this.tokenIndex >= 0) ? this.tokens[this.tokenIndex] : null;
const comment = (this.commentIndex >= 0) ? this.comments[this.commentIndex] : null;

if (token && (!comment || token.range[1] > comment.range[1])) {
this.current = token;
this.tokenIndex -= 1;
} else if (comment) {
this.current = comment;
this.commentIndex -= 1;
} else {
this.current = null;
}

return Boolean(this.current) && (this.border === -1 || this.current.range[0] >= this.border);
}
};
