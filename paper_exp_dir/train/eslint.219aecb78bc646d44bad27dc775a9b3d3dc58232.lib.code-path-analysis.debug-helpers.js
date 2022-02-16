

"use strict";





const debug = require("debug")("eslint:code-path");







function getId(segment) {
return segment.id + (segment.reachable ? "" : "!");
}





module.exports = {


enabled: debug.enabled,


dump: debug,


dumpState: !debug.enabled ? debug :   function(node, state, leaving) {
for (let i = 0; i < state.currentSegments.length; ++i) {
const segInternal = state.currentSegments[i].internal;

if (leaving) {
segInternal.exitNodes.push(node);
} else {
segInternal.nodes.push(node);
}
}

debug([
`${state.currentSegments.map(getId).join(",")})`,
`${node.type}${leaving ? ":exit" : ""}`
].join(" "));
},


dumpDot: !debug.enabled ? debug :   function(codePath) {
let text =
"\n" +
"digraph {\n" +
"node[shape=box,style=\"rounded,filled\",fillcolor=white];\n" +
"initial[label=\"\",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];\n";

if (codePath.returnedSegments.length > 0) {
text += "final[label=\"\",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];\n";
}
if (codePath.thrownSegments.length > 0) {
text += "thrown[label=\"✘\",shape=circle,width=0.3,height=0.3,fixedsize];\n";
}

const traceMap = Object.create(null);
const arrows = this.makeDotArrows(codePath, traceMap);

for (const id in traceMap) {
const segment = traceMap[id];

text += `${id}[`;

if (segment.reachable) {
text += "label=\"";
} else {
text += "style=\"rounded,dashed,filled\",fillcolor=\"#FF9800\",label=\"<<unreachable>>\\n";
}

if (segment.internal.nodes.length > 0 || segment.internal.exitNodes.length > 0) {
text += [].concat(
segment.internal.nodes.map(node => {
switch (node.type) {
case "Identifier": return `${node.type} (${node.name})`;
case "Literal": return `${node.type} (${node.value})`;
default: return node.type;
}
}),
segment.internal.exitNodes.map(node => {
switch (node.type) {
case "Identifier": return `${node.type}:exit (${node.name})`;
case "Literal": return `${node.type}:exit (${node.value})`;
default: return `${node.type}:exit`;
}
})
).join("\\n");
} else {
text += "????";
}

text += "\"];\n";
}

text += `${arrows}\n`;
text += "}";
debug("DOT", text);
},


makeDotArrows(codePath, traceMap) {
const stack = [[codePath.initialSegment, 0]];
const done = traceMap || Object.create(null);
let lastId = codePath.initialSegment.id;
let text = `initial->${codePath.initialSegment.id}`;

while (stack.length > 0) {
const item = stack.pop();
const segment = item[0];
const index = item[1];

if (done[segment.id] && index === 0) {
continue;
}
done[segment.id] = segment;

const nextSegment = segment.allNextSegments[index];

if (!nextSegment) {
continue;
}

if (lastId === segment.id) {
text += `->${nextSegment.id}`;
} else {
text += `;\n${segment.id}->${nextSegment.id}`;
}
lastId = nextSegment.id;

stack.unshift([segment, 1 + index]);
stack.push([nextSegment, 0]);
}

codePath.returnedSegments.forEach(finalSegment => {
if (lastId === finalSegment.id) {
text += "->final";
} else {
text += `;\n${finalSegment.id}->final`;
}
lastId = null;
});

codePath.thrownSegments.forEach(finalSegment => {
if (lastId === finalSegment.id) {
text += "->thrown";
} else {
text += `;\n${finalSegment.id}->thrown`;
}
lastId = null;
});

return `${text};`;
}
};
