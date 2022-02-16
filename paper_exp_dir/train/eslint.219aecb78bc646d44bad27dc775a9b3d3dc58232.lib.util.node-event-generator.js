

"use strict";





const esquery = require("esquery");
const lodash = require("lodash");












function getPossibleTypes(parsedSelector) {
switch (parsedSelector.type) {
case "identifier":
return [parsedSelector.value];

case "matches": {
const typesForComponents = parsedSelector.selectors.map(getPossibleTypes);

if (typesForComponents.every(Boolean)) {
return lodash.union(...typesForComponents);
}
return null;
}

case "compound": {
const typesForComponents = parsedSelector.selectors.map(getPossibleTypes).filter(typesForComponent => typesForComponent);


if (!typesForComponents.length) {
return null;
}


return lodash.intersection(...typesForComponents);
}

case "child":
case "descendant":
case "sibling":
case "adjacent":
return getPossibleTypes(parsedSelector.right);

default:
return null;

}
}


function countClassAttributes(parsedSelector) {
switch (parsedSelector.type) {
case "child":
case "descendant":
case "sibling":
case "adjacent":
return countClassAttributes(parsedSelector.left) + countClassAttributes(parsedSelector.right);

case "compound":
case "not":
case "matches":
return parsedSelector.selectors.reduce((sum, childSelector) => sum + countClassAttributes(childSelector), 0);

case "attribute":
case "field":
case "nth-child":
case "nth-last-child":
return 1;

default:
return 0;
}
}


function countIdentifiers(parsedSelector) {
switch (parsedSelector.type) {
case "child":
case "descendant":
case "sibling":
case "adjacent":
return countIdentifiers(parsedSelector.left) + countIdentifiers(parsedSelector.right);

case "compound":
case "not":
case "matches":
return parsedSelector.selectors.reduce((sum, childSelector) => sum + countIdentifiers(childSelector), 0);

case "identifier":
return 1;

default:
return 0;
}
}


function compareSpecificity(selectorA, selectorB) {
return selectorA.attributeCount - selectorB.attributeCount ||
selectorA.identifierCount - selectorB.identifierCount ||
(selectorA.rawSelector <= selectorB.rawSelector ? -1 : 1);
}


function tryParseSelector(rawSelector) {
try {
return esquery.parse(rawSelector.replace(/:exit$/u, ""));
} catch (err) {
if (typeof err.offset === "number") {
throw new SyntaxError(`Syntax error in selector "${rawSelector}" at position ${err.offset}: ${err.message}`);
}
throw err;
}
}


const parseSelector = lodash.memoize(rawSelector => {
const parsedSelector = tryParseSelector(rawSelector);

return {
rawSelector,
isExit: rawSelector.endsWith(":exit"),
parsedSelector,
listenerTypes: getPossibleTypes(parsedSelector),
attributeCount: countClassAttributes(parsedSelector),
identifierCount: countIdentifiers(parsedSelector)
};
});






class NodeEventGenerator {


constructor(emitter) {
this.emitter = emitter;
this.currentAncestry = [];
this.enterSelectorsByNodeType = new Map();
this.exitSelectorsByNodeType = new Map();
this.anyTypeEnterSelectors = [];
this.anyTypeExitSelectors = [];

emitter.eventNames().forEach(rawSelector => {
const selector = parseSelector(rawSelector);

if (selector.listenerTypes) {
selector.listenerTypes.forEach(nodeType => {
const typeMap = selector.isExit ? this.exitSelectorsByNodeType : this.enterSelectorsByNodeType;

if (!typeMap.has(nodeType)) {
typeMap.set(nodeType, []);
}
typeMap.get(nodeType).push(selector);
});
} else {
(selector.isExit ? this.anyTypeExitSelectors : this.anyTypeEnterSelectors).push(selector);
}
});

this.anyTypeEnterSelectors.sort(compareSpecificity);
this.anyTypeExitSelectors.sort(compareSpecificity);
this.enterSelectorsByNodeType.forEach(selectorList => selectorList.sort(compareSpecificity));
this.exitSelectorsByNodeType.forEach(selectorList => selectorList.sort(compareSpecificity));
}


applySelector(node, selector) {
if (esquery.matches(node, selector.parsedSelector, this.currentAncestry)) {
this.emitter.emit(selector.rawSelector, node);
}
}


applySelectors(node, isExit) {
const selectorsByNodeType = (isExit ? this.exitSelectorsByNodeType : this.enterSelectorsByNodeType).get(node.type) || [];
const anyTypeSelectors = isExit ? this.anyTypeExitSelectors : this.anyTypeEnterSelectors;


let selectorsByTypeIndex = 0;
let anyTypeSelectorsIndex = 0;

while (selectorsByTypeIndex < selectorsByNodeType.length || anyTypeSelectorsIndex < anyTypeSelectors.length) {
if (
selectorsByTypeIndex >= selectorsByNodeType.length ||
anyTypeSelectorsIndex < anyTypeSelectors.length &&
compareSpecificity(anyTypeSelectors[anyTypeSelectorsIndex], selectorsByNodeType[selectorsByTypeIndex]) < 0
) {
this.applySelector(node, anyTypeSelectors[anyTypeSelectorsIndex++]);
} else {
this.applySelector(node, selectorsByNodeType[selectorsByTypeIndex++]);
}
}
}


enterNode(node) {
if (node.parent) {
this.currentAncestry.unshift(node.parent);
}
this.applySelectors(node, false);
}


leaveNode(node) {
this.applySelectors(node, true);
this.currentAncestry.shift();
}
}

module.exports = NodeEventGenerator;
