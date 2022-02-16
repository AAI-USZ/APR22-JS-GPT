

"use strict";





const debug = require("./debug-helpers");






function isReachable(segment) {
return segment.reachable;
}






class CodePathSegment {


constructor(id, allPrevSegments, reachable) {


this.id = id;


this.nextSegments = [];


this.prevSegments = allPrevSegments.filter(isReachable);


this.allNextSegments = [];


this.allPrevSegments = allPrevSegments;


this.reachable = reachable;


Object.defineProperty(this, "internal", {
value: {
used: false,
loopedPrevSegments: []
}
});


if (debug.enabled) {
this.internal.nodes = [];
this.internal.exitNodes = [];
}
}


isLoopedPrevSegment(segment) {
return this.internal.loopedPrevSegments.indexOf(segment) !== -1;
}


static newRoot(id) {
return new CodePathSegment(id, [], true);
}


static newNext(id, allPrevSegments) {
return new CodePathSegment(
id,
CodePathSegment.flattenUnusedSegments(allPrevSegments),
allPrevSegments.some(isReachable)
);
}


static newUnreachable(id, allPrevSegments) {
const segment = new CodePathSegment(id, CodePathSegment.flattenUnusedSegments(allPrevSegments), false);


CodePathSegment.markUsed(segment);

return segment;
}


static newDisconnected(id, allPrevSegments) {
return new CodePathSegment(id, [], allPrevSegments.some(isReachable));
}


static markUsed(segment) {
if (segment.internal.used) {
return;
}
segment.internal.used = true;

let i;

if (segment.reachable) {
for (i = 0; i < segment.allPrevSegments.length; ++i) {
const prevSegment = segment.allPrevSegments[i];

prevSegment.allNextSegments.push(segment);
prevSegment.nextSegments.push(segment);
}
} else {
for (i = 0; i < segment.allPrevSegments.length; ++i) {
segment.allPrevSegments[i].allNextSegments.push(segment);
}
}
}


static markPrevSegmentAsLooped(segment, prevSegment) {
segment.internal.loopedPrevSegments.push(prevSegment);
}


static flattenUnusedSegments(segments) {
const done = Object.create(null);
const retv = [];

for (let i = 0; i < segments.length; ++i) {
const segment = segments[i];


if (done[segment.id]) {
continue;
}


if (!segment.internal.used) {
for (let j = 0; j < segment.allPrevSegments.length; ++j) {
const prevSegment = segment.allPrevSegments[j];

if (!done[prevSegment.id]) {
done[prevSegment.id] = true;
retv.push(prevSegment);
}
}
} else {
done[segment.id] = true;
retv.push(segment);
}
}

return retv;
}
}

module.exports = CodePathSegment;
