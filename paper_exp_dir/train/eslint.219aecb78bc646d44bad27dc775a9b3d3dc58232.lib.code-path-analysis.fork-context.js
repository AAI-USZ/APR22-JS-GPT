

"use strict";





const assert = require("assert"),
CodePathSegment = require("./code-path-segment");






function isReachable(segment) {
return segment.reachable;
}


function makeSegments(context, begin, end, create) {
const list = context.segmentsList;

const normalizedBegin = begin >= 0 ? begin : list.length + begin;
const normalizedEnd = end >= 0 ? end : list.length + end;

const segments = [];

for (let i = 0; i < context.count; ++i) {
const allPrevSegments = [];

for (let j = normalizedBegin; j <= normalizedEnd; ++j) {
allPrevSegments.push(list[j][i]);
}

segments.push(create(context.idGenerator.next(), allPrevSegments));
}

return segments;
}


function mergeExtraSegments(context, segments) {
let currentSegments = segments;

while (currentSegments.length > context.count) {
const merged = [];

for (let i = 0, length = currentSegments.length / 2 | 0; i < length; ++i) {
merged.push(CodePathSegment.newNext(
context.idGenerator.next(),
[currentSegments[i], currentSegments[i + length]]
));
}
currentSegments = merged;
}
return currentSegments;
}






class ForkContext {


constructor(idGenerator, upper, count) {
this.idGenerator = idGenerator;
this.upper = upper;
this.count = count;
this.segmentsList = [];
}


get head() {
const list = this.segmentsList;

return list.length === 0 ? [] : list[list.length - 1];
}


get empty() {
return this.segmentsList.length === 0;
}


get reachable() {
const segments = this.head;

return segments.length > 0 && segments.some(isReachable);
}


makeNext(begin, end) {
return makeSegments(this, begin, end, CodePathSegment.newNext);
}


makeUnreachable(begin, end) {
return makeSegments(this, begin, end, CodePathSegment.newUnreachable);
}


makeDisconnected(begin, end) {
return makeSegments(this, begin, end, CodePathSegment.newDisconnected);
}


add(segments) {
assert(segments.length >= this.count, `${segments.length} >= ${this.count}`);

this.segmentsList.push(mergeExtraSegments(this, segments));
}


replaceHead(segments) {
assert(segments.length >= this.count, `${segments.length} >= ${this.count}`);

this.segmentsList.splice(-1, 1, mergeExtraSegments(this, segments));
}


addAll(context) {
assert(context.count === this.count);

const source = context.segmentsList;

for (let i = 0; i < source.length; ++i) {
this.segmentsList.push(source[i]);
}
}


clear() {
this.segmentsList = [];
}


static newRoot(idGenerator) {
const context = new ForkContext(idGenerator, null, 1);

context.add([CodePathSegment.newRoot(idGenerator.next())]);

return context;
}


static newEmpty(parentContext, forkLeavingPath) {
return new ForkContext(
parentContext.idGenerator,
parentContext,
(forkLeavingPath ? 2 : 1) * parentContext.count
);
}
}

module.exports = ForkContext;
