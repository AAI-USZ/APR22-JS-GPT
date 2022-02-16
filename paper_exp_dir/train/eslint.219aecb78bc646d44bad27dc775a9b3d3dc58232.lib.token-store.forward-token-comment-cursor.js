
"use strict";





const Cursor = require("./cursor");
const utils = require("./utils");






module.exports = class ForwardTokenCommentCursor extends Cursor {


constructor(tokens, comments, indexMap, startLoc, endLoc) {
super();
this.tokens = tokens;
this.comments = comments;
this.tokenIndex = utils.getFirstIndex(tokens, indexMap, startLoc);
this.commentIndex = utils.search(comments, startLoc);
this.border = endLoc;
}


moveNext() {
const token = (this.tokenIndex < this.tokens.length) ? this.tokens[this.tokenIndex] : null;
const comment = (this.commentIndex < this.comments.length) ? this.comments[this.commentIndex] : null;

if (token && (!comment || token.range[0] < comment.range[0])) {
this.current = token;
this.tokenIndex += 1;
} else if (comment) {
this.current = comment;
this.commentIndex += 1;
} else {
this.current = null;
}

return Boolean(this.current) && (this.border === -1 || this.current.range[1] <= this.border);
}
};
