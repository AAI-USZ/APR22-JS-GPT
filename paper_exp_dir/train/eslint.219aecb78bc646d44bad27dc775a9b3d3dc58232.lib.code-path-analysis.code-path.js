

"use strict";





const CodePathState = require("./code-path-state");
const IdGenerator = require("./id-generator");






class CodePath {


constructor(id, upper, onLooped) {


this.id = id;


this.upper = upper;


this.childCodePaths = [];


Object.defineProperty(
this,
"internal",
{ value: new CodePathState(new IdGenerator(`${id}_`), onLooped) }
);


if (upper) {
upper.childCodePaths.push(this);
}
}


static getState(codePath) {
return codePath.internal;
}


get initialSegment() {
return this.internal.initialSegment;
}


get finalSegments() {
return this.internal.finalSegments;
}


get returnedSegments() {
return this.internal.returnedForkContext;
}


get thrownSegments() {
return this.internal.thrownForkContext;
}


get currentSegments() {
return this.internal.currentSegments;
}


traverseSegments(options, callback) {
let resolvedOptions;
let resolvedCallback;

if (typeof options === "function") {
resolvedCallback = options;
resolvedOptions = {};
} else {
resolvedOptions = options || {};
resolvedCallback = callback;
}

const startSegment = resolvedOptions.first || this.internal.initialSegment;
const lastSegment = resolvedOptions.last;

let item = null;
let index = 0;
let end = 0;
let segment = null;
const visited = Object.create(null);
const stack = [[startSegment, 0]];
let skippedSegment = null;
let broken = false;
const controller = {
skip() {
if (stack.length <= 1) {
broken = true;
} else {
skippedSegment = stack[stack.length - 2][0];
}
},
break() {
broken = true;
}
};


function isVisited(prevSegment) {
return (
visited[prevSegment.id] ||
segment.isLoopedPrevSegment(prevSegment)
);
}

while (stack.length > 0) {
item = stack[stack.length - 1];
segment = item[0];
index = item[1];

if (index === 0) {


if (visited[segment.id]) {
stack.pop();
continue;
}


if (segment !== startSegment &&
segment.prevSegments.length > 0 &&
!segment.prevSegments.every(isVisited)
) {
stack.pop();
continue;
}


if (skippedSegment && segment.prevSegments.indexOf(skippedSegment) !== -1) {
skippedSegment = null;
}
visited[segment.id] = true;


if (!skippedSegment) {
resolvedCallback.call(this, segment, controller);
if (segment === lastSegment) {
controller.skip();
}
if (broken) {
break;
}
}
}


end = segment.nextSegments.length - 1;
if (index < end) {
item[1] += 1;
stack.push([segment.nextSegments[index], 0]);
} else if (index === end) {
item[0] = segment.nextSegments[index];
item[1] = 0;
} else {
stack.pop();
}
}
}
}

module.exports = CodePath;
