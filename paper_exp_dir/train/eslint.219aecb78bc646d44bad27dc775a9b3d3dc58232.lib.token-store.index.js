
"use strict";





const assert = require("assert");
const { isCommentToken } = require("eslint-utils");
const cursors = require("./cursors");
const ForwardTokenCursor = require("./forward-token-cursor");
const PaddedTokenCursor = require("./padded-token-cursor");
const utils = require("./utils");





const TOKENS = Symbol("tokens");
const COMMENTS = Symbol("comments");
const INDEX_MAP = Symbol("indexMap");


function createIndexMap(tokens, comments) {
const map = Object.create(null);
let tokenIndex = 0;
let commentIndex = 0;
let nextStart = 0;
let range = null;

while (tokenIndex < tokens.length || commentIndex < comments.length) {
nextStart = (commentIndex < comments.length) ? comments[commentIndex].range[0] : Number.MAX_SAFE_INTEGER;
while (tokenIndex < tokens.length && (range = tokens[tokenIndex].range)[0] < nextStart) {
map[range[0]] = tokenIndex;
map[range[1] - 1] = tokenIndex;
tokenIndex += 1;
}

nextStart = (tokenIndex < tokens.length) ? tokens[tokenIndex].range[0] : Number.MAX_SAFE_INTEGER;
while (commentIndex < comments.length && (range = comments[commentIndex].range)[0] < nextStart) {
map[range[0]] = tokenIndex;
map[range[1] - 1] = tokenIndex;
commentIndex += 1;
}
}

return map;
}


function createCursorWithSkip(factory, tokens, comments, indexMap, startLoc, endLoc, opts) {
let includeComments = false;
let skip = 0;
let filter = null;

if (typeof opts === "number") {
skip = opts | 0;
} else if (typeof opts === "function") {
filter = opts;
} else if (opts) {
includeComments = !!opts.includeComments;
skip = opts.skip | 0;
filter = opts.filter || null;
}
assert(skip >= 0, "options.skip should be zero or a positive integer.");
assert(!filter || typeof filter === "function", "options.filter should be a function.");

return factory.createCursor(tokens, comments, indexMap, startLoc, endLoc, includeComments, filter, skip, -1);
}


function createCursorWithCount(factory, tokens, comments, indexMap, startLoc, endLoc, opts) {
let includeComments = false;
let count = 0;
let countExists = false;
let filter = null;

if (typeof opts === "number") {
count = opts | 0;
countExists = true;
} else if (typeof opts === "function") {
filter = opts;
} else if (opts) {
includeComments = !!opts.includeComments;
count = opts.count | 0;
countExists = typeof opts.count === "number";
filter = opts.filter || null;
}
assert(count >= 0, "options.count should be zero or a positive integer.");
assert(!filter || typeof filter === "function", "options.filter should be a function.");

return factory.createCursor(tokens, comments, indexMap, startLoc, endLoc, includeComments, filter, 0, countExists ? count : -1);
}



function createCursorWithPadding(tokens, comments, indexMap, startLoc, endLoc, beforeCount, afterCount) {
if (typeof beforeCount === "undefined" && typeof afterCount === "undefined") {
return new ForwardTokenCursor(tokens, comments, indexMap, startLoc, endLoc);
}
if (typeof beforeCount === "number" || typeof beforeCount === "undefined") {
return new PaddedTokenCursor(tokens, comments, indexMap, startLoc, endLoc, beforeCount | 0, afterCount | 0);
}
return createCursorWithCount(cursors.forward, tokens, comments, indexMap, startLoc, endLoc, beforeCount);
}


function getAdjacentCommentTokensFromCursor(cursor) {
const tokens = [];
let currentToken = cursor.getOneToken();

while (currentToken && isCommentToken(currentToken)) {
tokens.push(currentToken);
currentToken = cursor.getOneToken();
}

return tokens;
}






module.exports = class TokenStore {


constructor(tokens, comments) {
this[TOKENS] = tokens;
this[COMMENTS] = comments;
this[INDEX_MAP] = createIndexMap(tokens, comments);
}






getTokenByRangeStart(offset, options) {
const includeComments = options && options.includeComments;
const token = cursors.forward.createBaseCursor(
this[TOKENS],
this[COMMENTS],
this[INDEX_MAP],
offset,
-1,
includeComments
).getOneToken();

if (token && token.range[0] === offset) {
return token;
}
return null;
}


getFirstToken(node, options) {
return createCursorWithSkip(
cursors.forward,
this[TOKENS],
this[COMMENTS],
this[INDEX_MAP],
node.range[0],
node.range[1],
options
).getOneToken();
}


getLastToken(node, options) {
return createCursorWithSkip(
cursors.backward,
this[TOKENS],
this[COMMENTS],
this[INDEX_MAP],
node.range[0],
node.range[1],
options
).getOneToken();
}


getTokenBefore(node, options) {
return createCursorWithSkip(
cursors.backward,
this[TOKENS],
this[COMMENTS],
this[INDEX_MAP],
-1,
node.range[0],
options
).getOneToken();
}


getTokenAfter(node, options) {
return createCursorWithSkip(
cursors.forward,
this[TOKENS],
this[COMMENTS],
this[INDEX_MAP],
node.range[1],
-1,
options
).getOneToken();
}


getFirstTokenBetween(left, right, options) {
return createCursorWithSkip(
cursors.forward,
this[TOKENS],
this[COMMENTS],
this[INDEX_MAP],
left.range[1],
right.range[0],
options
).getOneToken();
}


getLastTokenBetween(left, right, options) {
return createCursorWithSkip(
cursors.backward,
this[TOKENS],
this[COMMENTS],
this[INDEX_MAP],
left.range[1],
right.range[0],
options
).getOneToken();
}


getTokenOrCommentBefore(node, skip) {
return this.getTokenBefore(node, { includeComments: true, skip });
}


getTokenOrCommentAfter(node, skip) {
return this.getTokenAfter(node, { includeComments: true, skip });
}






getFirstTokens(node, options) {
return createCursorWithCount(
cursors.forward,
this[TOKENS],
this[COMMENTS],
this[INDEX_MAP],
node.range[0],
node.range[1],
options
).getAllTokens();
}


getLastTokens(node, options) {
return createCursorWithCount(
cursors.backward,
this[TOKENS],
this[COMMENTS],
this[INDEX_MAP],
node.range[0],
node.range[1],
options
).getAllTokens().reverse();
}


getTokensBefore(node, options) {
return createCursorWithCount(
cursors.backward,
this[TOKENS],
this[COMMENTS],
this[INDEX_MAP],
-1,
node.range[0],
options
).getAllTokens().reverse();
}


getTokensAfter(node, options) {
return createCursorWithCount(
cursors.forward,
this[TOKENS],
this[COMMENTS],
this[INDEX_MAP],
node.range[1],
-1,
options
).getAllTokens();
}


getFirstTokensBetween(left, right, options) {
return createCursorWithCount(
cursors.forward,
this[TOKENS],
this[COMMENTS],
this[INDEX_MAP],
left.range[1],
right.range[0],
options
).getAllTokens();
}


getLastTokensBetween(left, right, options) {
return createCursorWithCount(
cursors.backward,
this[TOKENS],
this[COMMENTS],
this[INDEX_MAP],
left.range[1],
right.range[0],
options
).getAllTokens().reverse();
}



getTokens(node, beforeCount, afterCount) {
return createCursorWithPadding(
this[TOKENS],
this[COMMENTS],
this[INDEX_MAP],
node.range[0],
node.range[1],
beforeCount,
afterCount
).getAllTokens();
}



getTokensBetween(left, right, padding) {
return createCursorWithPadding(
this[TOKENS],
this[COMMENTS],
this[INDEX_MAP],
left.range[1],
right.range[0],
padding,
padding
).getAllTokens();
}






commentsExistBetween(left, right) {
const index = utils.search(this[COMMENTS], left.range[1]);

return (
index < this[COMMENTS].length &&
this[COMMENTS][index].range[1] <= right.range[0]
);
}


getCommentsBefore(nodeOrToken) {
const cursor = createCursorWithCount(
cursors.backward,
this[TOKENS],
this[COMMENTS],
this[INDEX_MAP],
-1,
nodeOrToken.range[0],
{ includeComments: true }
);

return getAdjacentCommentTokensFromCursor(cursor).reverse();
}


getCommentsAfter(nodeOrToken) {
const cursor = createCursorWithCount(
cursors.forward,
this[TOKENS],
this[COMMENTS],
this[INDEX_MAP],
nodeOrToken.range[1],
-1,
{ includeComments: true }
);

return getAdjacentCommentTokensFromCursor(cursor);
}


getCommentsInside(node) {
return this.getTokens(node, {
includeComments: true,
filter: isCommentToken
});
}
};
