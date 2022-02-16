

"use strict";





const CodePathSegment = require("./code-path-segment"),
ForkContext = require("./fork-context");






function addToReturnedOrThrown(dest, others, all, segments) {
for (let i = 0; i < segments.length; ++i) {
const segment = segments[i];

dest.push(segment);
if (others.indexOf(segment) === -1) {
all.push(segment);
}
}
}


function getContinueContext(state, label) {
if (!label) {
return state.loopContext;
}

let context = state.loopContext;

while (context) {
if (context.label === label) {
return context;
}
context = context.upper;
}


return null;
}


function getBreakContext(state, label) {
let context = state.breakContext;

while (context) {
if (label ? context.label === label : context.breakable) {
return context;
}
context = context.upper;
}


return null;
}


function getReturnContext(state) {
let context = state.tryContext;

while (context) {
if (context.hasFinalizer && context.position !== "finally") {
return context;
}
context = context.upper;
}

return state;
}


function getThrowContext(state) {
let context = state.tryContext;

while (context) {
if (context.position === "try" ||
(context.hasFinalizer && context.position === "catch")
) {
return context;
}
context = context.upper;
}

return state;
}


function remove(xs, x) {
xs.splice(xs.indexOf(x), 1);
}


function removeConnection(prevSegments, nextSegments) {
for (let i = 0; i < prevSegments.length; ++i) {
const prevSegment = prevSegments[i];
const nextSegment = nextSegments[i];

remove(prevSegment.nextSegments, nextSegment);
remove(prevSegment.allNextSegments, nextSegment);
remove(nextSegment.prevSegments, prevSegment);
remove(nextSegment.allPrevSegments, prevSegment);
}
}


function makeLooped(state, unflattenedFromSegments, unflattenedToSegments) {
const fromSegments = CodePathSegment.flattenUnusedSegments(unflattenedFromSegments);
const toSegments = CodePathSegment.flattenUnusedSegments(unflattenedToSegments);

const end = Math.min(fromSegments.length, toSegments.length);

for (let i = 0; i < end; ++i) {
const fromSegment = fromSegments[i];
const toSegment = toSegments[i];

if (toSegment.reachable) {
fromSegment.nextSegments.push(toSegment);
}
if (fromSegment.reachable) {
toSegment.prevSegments.push(fromSegment);
}
fromSegment.allNextSegments.push(toSegment);
toSegment.allPrevSegments.push(fromSegment);

if (toSegment.allPrevSegments.length >= 2) {
CodePathSegment.markPrevSegmentAsLooped(toSegment, fromSegment);
}

state.notifyLooped(fromSegment, toSegment);
}
}


function finalizeTestSegmentsOfFor(context, choiceContext, head) {
if (!choiceContext.processed) {
choiceContext.trueForkContext.add(head);
choiceContext.falseForkContext.add(head);
}

if (context.test !== true) {
context.brokenForkContext.addAll(choiceContext.falseForkContext);
}
context.endOfTestSegments = choiceContext.trueForkContext.makeNext(0, -1);
}






class CodePathState {


constructor(idGenerator, onLooped) {
this.idGenerator = idGenerator;
this.notifyLooped = onLooped;
this.forkContext = ForkContext.newRoot(idGenerator);
this.choiceContext = null;
this.switchContext = null;
this.tryContext = null;
this.loopContext = null;
this.breakContext = null;

this.currentSegments = [];
this.initialSegment = this.forkContext.head[0];


const final = this.finalSegments = [];
const returned = this.returnedForkContext = [];
const thrown = this.thrownForkContext = [];

returned.add = addToReturnedOrThrown.bind(null, returned, thrown, final);
thrown.add = addToReturnedOrThrown.bind(null, thrown, returned, final);
}


get headSegments() {
return this.forkContext.head;
}


get parentForkContext() {
const current = this.forkContext;

return current && current.upper;
}


pushForkContext(forkLeavingPath) {
this.forkContext = ForkContext.newEmpty(
this.forkContext,
forkLeavingPath
);

return this.forkContext;
}


popForkContext() {
const lastContext = this.forkContext;

this.forkContext = lastContext.upper;
this.forkContext.replaceHead(lastContext.makeNext(0, -1));

return lastContext;
}


forkPath() {
this.forkContext.add(this.parentForkContext.makeNext(-1, -1));
}


forkBypassPath() {
this.forkContext.add(this.parentForkContext.head);
}






pushChoiceContext(kind, isForkingAsResult) {
this.choiceContext = {
upper: this.choiceContext,
kind,
isForkingAsResult,
trueForkContext: ForkContext.newEmpty(this.forkContext),
falseForkContext: ForkContext.newEmpty(this.forkContext),
processed: false
};
}


popChoiceContext() {
const context = this.choiceContext;

this.choiceContext = context.upper;

const forkContext = this.forkContext;
const headSegments = forkContext.head;

switch (context.kind) {
case "&&":
case "||":


if (!context.processed) {
context.trueForkContext.add(headSegments);
context.falseForkContext.add(headSegments);
}


if (context.isForkingAsResult) {
const parentContext = this.choiceContext;

parentContext.trueForkContext.addAll(context.trueForkContext);
parentContext.falseForkContext.addAll(context.falseForkContext);
parentContext.processed = true;

return context;
}

break;

case "test":
if (!context.processed) {


context.trueForkContext.clear();
context.trueForkContext.add(headSegments);
} else {


context.falseForkContext.clear();
context.falseForkContext.add(headSegments);
}

break;

case "loop":


return context;


default:
throw new Error("unreachable");
}


const prevForkContext = context.trueForkContext;

prevForkContext.addAll(context.falseForkContext);
forkContext.replaceHead(prevForkContext.makeNext(0, -1));

return context;
}


makeLogicalRight() {
const context = this.choiceContext;
const forkContext = this.forkContext;

if (context.processed) {


const prevForkContext =
context.kind === "&&" ? context.trueForkContext
: context.falseForkContext;

forkContext.replaceHead(prevForkContext.makeNext(0, -1));
prevForkContext.clear();

context.processed = false;
} else {


if (context.kind === "&&") {


context.falseForkContext.add(forkContext.head);
} else {


context.trueForkContext.add(forkContext.head);
}

forkContext.replaceHead(forkContext.makeNext(-1, -1));
}
}


makeIfConsequent() {
const context = this.choiceContext;
const forkContext = this.forkContext;


if (!context.processed) {
context.trueForkContext.add(forkContext.head);
context.falseForkContext.add(forkContext.head);
}

context.processed = false;


forkContext.replaceHead(
context.trueForkContext.makeNext(0, -1)
);
}


makeIfAlternate() {
const context = this.choiceContext;
const forkContext = this.forkContext;


context.trueForkContext.clear();
context.trueForkContext.add(forkContext.head);
context.processed = true;


forkContext.replaceHead(
context.falseForkContext.makeNext(0, -1)
);
}






pushSwitchContext(hasCase, label) {
this.switchContext = {
upper: this.switchContext,
hasCase,
defaultSegments: null,
defaultBodySegments: null,
foundDefault: false,
lastIsDefault: false,
countForks: 0
};

this.pushBreakContext(true, label);
}


popSwitchContext() {
const context = this.switchContext;

this.switchContext = context.upper;

const forkContext = this.forkContext;
const brokenForkContext = this.popBreakContext().brokenForkContext;

if (context.countForks === 0) {


if (!brokenForkContext.empty) {
brokenForkContext.add(forkContext.makeNext(-1, -1));
forkContext.replaceHead(brokenForkContext.makeNext(0, -1));
}

return;
}

const lastSegments = forkContext.head;

this.forkBypassPath();
const lastCaseSegments = forkContext.head;


brokenForkContext.add(lastSegments);


if (!context.lastIsDefault) {
if (context.defaultBodySegments) {


removeConnection(context.defaultSegments, context.defaultBodySegments);
makeLooped(this, lastCaseSegments, context.defaultBodySegments);
} else {


brokenForkContext.add(lastCaseSegments);
}
}


for (let i = 0; i < context.countForks; ++i) {
this.forkContext = this.forkContext.upper;
}


this.forkContext.replaceHead(brokenForkContext.makeNext(0, -1));
}


makeSwitchCaseBody(isEmpty, isDefault) {
const context = this.switchContext;

if (!context.hasCase) {
return;
}


const parentForkContext = this.forkContext;
const forkContext = this.pushForkContext();

forkContext.add(parentForkContext.makeNext(0, -1));


if (isDefault) {
context.defaultSegments = parentForkContext.head;
if (isEmpty) {
context.foundDefault = true;
} else {
context.defaultBodySegments = forkContext.head;
}
} else {
if (!isEmpty && context.foundDefault) {
context.foundDefault = false;
context.defaultBodySegments = forkContext.head;
}
}

context.lastIsDefault = isDefault;
context.countForks += 1;
}






pushTryContext(hasFinalizer) {
this.tryContext = {
upper: this.tryContext,
position: "try",
hasFinalizer,

returnedForkContext: hasFinalizer
? ForkContext.newEmpty(this.forkContext)
: null,

thrownForkContext: ForkContext.newEmpty(this.forkContext),
lastOfTryIsReachable: false,
lastOfCatchIsReachable: false
};
}


popTryContext() {
const context = this.tryContext;

this.tryContext = context.upper;

if (context.position === "catch") {


this.popForkContext();
return;
}



const returned = context.returnedForkContext;
const thrown = context.thrownForkContext;

if (returned.empty && thrown.empty) {
return;
}


const headSegments = this.forkContext.head;

this.forkContext = this.forkContext.upper;
const normalSegments = headSegments.slice(0, headSegments.length / 2 | 0);
const leavingSegments = headSegments.slice(headSegments.length / 2 | 0);


if (!returned.empty) {
getReturnContext(this).returnedForkContext.add(leavingSegments);
}
if (!thrown.empty) {
getThrowContext(this).thrownForkContext.add(leavingSegments);
}


this.forkContext.replaceHead(normalSegments);


if (!context.lastOfTryIsReachable && !context.lastOfCatchIsReachable) {
this.forkContext.makeUnreachable();
}
}


makeCatchBlock() {
const context = this.tryContext;
const forkContext = this.forkContext;
const thrown = context.thrownForkContext;


context.position = "catch";
context.thrownForkContext = ForkContext.newEmpty(forkContext);
context.lastOfTryIsReachable = forkContext.reachable;


thrown.add(forkContext.head);
const thrownSegments = thrown.makeNext(0, -1);


this.pushForkContext();
this.forkBypassPath();
this.forkContext.add(thrownSegments);
}


makeFinallyBlock() {
const context = this.tryContext;
let forkContext = this.forkContext;
const returned = context.returnedForkContext;
const thrown = context.thrownForkContext;
const headOfLeavingSegments = forkContext.head;


if (context.position === "catch") {


this.popForkContext();
forkContext = this.forkContext;

context.lastOfCatchIsReachable = forkContext.reachable;
} else {
context.lastOfTryIsReachable = forkContext.reachable;
}
context.position = "finally";

if (returned.empty && thrown.empty) {


return;
}


const segments = forkContext.makeNext(-1, -1);

for (let i = 0; i < forkContext.count; ++i) {
const prevSegsOfLeavingSegment = [headOfLeavingSegments[i]];

for (let j = 0; j < returned.segmentsList.length; ++j) {
prevSegsOfLeavingSegment.push(returned.segmentsList[j][i]);
}
for (let j = 0; j < thrown.segmentsList.length; ++j) {
prevSegsOfLeavingSegment.push(thrown.segmentsList[j][i]);
}

segments.push(
CodePathSegment.newNext(
this.idGenerator.next(),
prevSegsOfLeavingSegment
)
);
}

this.pushForkContext(true);
this.forkContext.add(segments);
}


makeFirstThrowablePathInTryBlock() {
const forkContext = this.forkContext;

if (!forkContext.reachable) {
return;
}

const context = getThrowContext(this);

if (context === this ||
context.position !== "try" ||
!context.thrownForkContext.empty
) {
return;
}

context.thrownForkContext.add(forkContext.head);
forkContext.replaceHead(forkContext.makeNext(-1, -1));
}






pushLoopContext(type, label) {
const forkContext = this.forkContext;
const breakContext = this.pushBreakContext(true, label);

switch (type) {
case "WhileStatement":
this.pushChoiceContext("loop", false);
this.loopContext = {
upper: this.loopContext,
type,
label,
test: void 0,
continueDestSegments: null,
brokenForkContext: breakContext.brokenForkContext
};
break;

case "DoWhileStatement":
this.pushChoiceContext("loop", false);
this.loopContext = {
upper: this.loopContext,
type,
label,
test: void 0,
entrySegments: null,
continueForkContext: ForkContext.newEmpty(forkContext),
brokenForkContext: breakContext.brokenForkContext
};
break;

case "ForStatement":
this.pushChoiceContext("loop", false);
this.loopContext = {
upper: this.loopContext,
type,
label,
test: void 0,
endOfInitSegments: null,
testSegments: null,
endOfTestSegments: null,
updateSegments: null,
endOfUpdateSegments: null,
continueDestSegments: null,
brokenForkContext: breakContext.brokenForkContext
};
break;

case "ForInStatement":
case "ForOfStatement":
this.loopContext = {
upper: this.loopContext,
type,
label,
prevSegments: null,
leftSegments: null,
endOfLeftSegments: null,
continueDestSegments: null,
brokenForkContext: breakContext.brokenForkContext
};
break;


default:
throw new Error(`unknown type: "${type}"`);
}
}


popLoopContext() {
const context = this.loopContext;

this.loopContext = context.upper;

const forkContext = this.forkContext;
const brokenForkContext = this.popBreakContext().brokenForkContext;


switch (context.type) {
case "WhileStatement":
case "ForStatement":
this.popChoiceContext();
makeLooped(
this,
forkContext.head,
context.continueDestSegments
);
break;

case "DoWhileStatement": {
const choiceContext = this.popChoiceContext();

if (!choiceContext.processed) {
choiceContext.trueForkContext.add(forkContext.head);
choiceContext.falseForkContext.add(forkContext.head);
}
if (context.test !== true) {
brokenForkContext.addAll(choiceContext.falseForkContext);
}


const segmentsList = choiceContext.trueForkContext.segmentsList;

for (let i = 0; i < segmentsList.length; ++i) {
makeLooped(
this,
segmentsList[i],
context.entrySegments
);
}
break;
}

case "ForInStatement":
case "ForOfStatement":
brokenForkContext.add(forkContext.head);
makeLooped(
this,
forkContext.head,
context.leftSegments
);
break;


default:
throw new Error("unreachable");
}


if (brokenForkContext.empty) {
forkContext.replaceHead(forkContext.makeUnreachable(-1, -1));
} else {
forkContext.replaceHead(brokenForkContext.makeNext(0, -1));
}
}


makeWhileTest(test) {
const context = this.loopContext;
const forkContext = this.forkContext;
const testSegments = forkContext.makeNext(0, -1);


context.test = test;
context.continueDestSegments = testSegments;
forkContext.replaceHead(testSegments);
}


makeWhileBody() {
const context = this.loopContext;
const choiceContext = this.choiceContext;
const forkContext = this.forkContext;

if (!choiceContext.processed) {
choiceContext.trueForkContext.add(forkContext.head);
choiceContext.falseForkContext.add(forkContext.head);
}


if (context.test !== true) {
context.brokenForkContext.addAll(choiceContext.falseForkContext);
}
forkContext.replaceHead(choiceContext.trueForkContext.makeNext(0, -1));
}


makeDoWhileBody() {
const context = this.loopContext;
const forkContext = this.forkContext;
const bodySegments = forkContext.makeNext(-1, -1);


context.entrySegments = bodySegments;
forkContext.replaceHead(bodySegments);
}


makeDoWhileTest(test) {
const context = this.loopContext;
const forkContext = this.forkContext;

context.test = test;


if (!context.continueForkContext.empty) {
context.continueForkContext.add(forkContext.head);
const testSegments = context.continueForkContext.makeNext(0, -1);

forkContext.replaceHead(testSegments);
}
}


makeForTest(test) {
const context = this.loopContext;
const forkContext = this.forkContext;
const endOfInitSegments = forkContext.head;
const testSegments = forkContext.makeNext(-1, -1);


context.test = test;
context.endOfInitSegments = endOfInitSegments;
context.continueDestSegments = context.testSegments = testSegments;
forkContext.replaceHead(testSegments);
}


makeForUpdate() {
const context = this.loopContext;
const choiceContext = this.choiceContext;
const forkContext = this.forkContext;


if (context.testSegments) {
finalizeTestSegmentsOfFor(
context,
choiceContext,
forkContext.head
);
} else {
context.endOfInitSegments = forkContext.head;
}


const updateSegments = forkContext.makeDisconnected(-1, -1);

context.continueDestSegments = context.updateSegments = updateSegments;
forkContext.replaceHead(updateSegments);
}


makeForBody() {
const context = this.loopContext;
const choiceContext = this.choiceContext;
const forkContext = this.forkContext;


if (context.updateSegments) {
context.endOfUpdateSegments = forkContext.head;


if (context.testSegments) {
makeLooped(
this,
context.endOfUpdateSegments,
context.testSegments
);
}
} else if (context.testSegments) {
finalizeTestSegmentsOfFor(
context,
choiceContext,
forkContext.head
);
} else {
context.endOfInitSegments = forkContext.head;
}

let bodySegments = context.endOfTestSegments;

if (!bodySegments) {


const prevForkContext = ForkContext.newEmpty(forkContext);

prevForkContext.add(context.endOfInitSegments);
if (context.endOfUpdateSegments) {
prevForkContext.add(context.endOfUpdateSegments);
}

bodySegments = prevForkContext.makeNext(0, -1);
}
context.continueDestSegments = context.continueDestSegments || bodySegments;
forkContext.replaceHead(bodySegments);
}


makeForInOfLeft() {
const context = this.loopContext;
const forkContext = this.forkContext;
const leftSegments = forkContext.makeDisconnected(-1, -1);


context.prevSegments = forkContext.head;
context.leftSegments = context.continueDestSegments = leftSegments;
forkContext.replaceHead(leftSegments);
}


makeForInOfRight() {
const context = this.loopContext;
const forkContext = this.forkContext;
const temp = ForkContext.newEmpty(forkContext);

temp.add(context.prevSegments);
const rightSegments = temp.makeNext(-1, -1);


context.endOfLeftSegments = forkContext.head;
forkContext.replaceHead(rightSegments);
}


makeForInOfBody() {
const context = this.loopContext;
const forkContext = this.forkContext;
const temp = ForkContext.newEmpty(forkContext);

temp.add(context.endOfLeftSegments);
const bodySegments = temp.makeNext(-1, -1);


makeLooped(this, forkContext.head, context.leftSegments);


context.brokenForkContext.add(forkContext.head);
forkContext.replaceHead(bodySegments);
}






pushBreakContext(breakable, label) {
this.breakContext = {
upper: this.breakContext,
breakable,
label,
brokenForkContext: ForkContext.newEmpty(this.forkContext)
};
return this.breakContext;
}


popBreakContext() {
const context = this.breakContext;
const forkContext = this.forkContext;

this.breakContext = context.upper;


if (!context.breakable) {
const brokenForkContext = context.brokenForkContext;

if (!brokenForkContext.empty) {
brokenForkContext.add(forkContext.head);
forkContext.replaceHead(brokenForkContext.makeNext(0, -1));
}
}

return context;
}


makeBreak(label) {
const forkContext = this.forkContext;

if (!forkContext.reachable) {
return;
}

const context = getBreakContext(this, label);


if (context) {
context.brokenForkContext.add(forkContext.head);
}

forkContext.replaceHead(forkContext.makeUnreachable(-1, -1));
}


makeContinue(label) {
const forkContext = this.forkContext;

if (!forkContext.reachable) {
return;
}

const context = getContinueContext(this, label);


if (context) {
if (context.continueDestSegments) {
makeLooped(this, forkContext.head, context.continueDestSegments);


if (context.type === "ForInStatement" ||
context.type === "ForOfStatement"
) {
context.brokenForkContext.add(forkContext.head);
}
} else {
context.continueForkContext.add(forkContext.head);
}
}
forkContext.replaceHead(forkContext.makeUnreachable(-1, -1));
}


makeReturn() {
const forkContext = this.forkContext;

if (forkContext.reachable) {
getReturnContext(this).returnedForkContext.add(forkContext.head);
forkContext.replaceHead(forkContext.makeUnreachable(-1, -1));
}
}


makeThrow() {
const forkContext = this.forkContext;

if (forkContext.reachable) {
getThrowContext(this).thrownForkContext.add(forkContext.head);
forkContext.replaceHead(forkContext.makeUnreachable(-1, -1));
}
}


makeFinal() {
const segments = this.currentSegments;

if (segments.length > 0 && segments[0].reachable) {
this.returnedForkContext.add(segments);
}
}
}

module.exports = CodePathState;
