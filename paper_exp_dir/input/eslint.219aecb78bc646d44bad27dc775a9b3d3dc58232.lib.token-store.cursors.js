
"use strict";





const BackwardTokenCommentCursor = require("./backward-token-comment-cursor");
const BackwardTokenCursor = require("./backward-token-cursor");
const FilterCursor = require("./filter-cursor");
const ForwardTokenCommentCursor = require("./forward-token-comment-cursor");
const ForwardTokenCursor = require("./forward-token-cursor");
const LimitCursor = require("./limit-cursor");
const SkipCursor = require("./skip-cursor");






class CursorFactory {


constructor(TokenCursor, TokenCommentCursor) {
this.TokenCursor = TokenCursor;
this.TokenCommentCursor = TokenCommentCursor;
}


createBaseCursor(tokens, comments, indexMap, startLoc, endLoc, includeComments) {
const Cursor = includeComments ? this.TokenCommentCursor : this.TokenCursor;

return new Cursor(tokens, comments, indexMap, startLoc, endLoc);
}


createCursor(tokens, comments, indexMap, startLoc, endLoc, includeComments, filter, skip, count) {
let cursor = this.createBaseCursor(tokens, comments, indexMap, startLoc, endLoc, includeComments);

if (filter) {
cursor = new FilterCursor(cursor, filter);
}
if (skip >= 1) {
cursor = new SkipCursor(cursor, skip);
}
if (count >= 0) {
cursor = new LimitCursor(cursor, count);
}

return cursor;
}
}





exports.forward = new CursorFactory(ForwardTokenCursor, ForwardTokenCommentCursor);
exports.backward = new CursorFactory(BackwardTokenCursor, BackwardTokenCommentCursor);
