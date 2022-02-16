

"use strict";






function getPropertyFromObject(property, node) {
const properties = node.properties;

for (let i = 0; i < properties.length; i++) {
if (properties[i].key.name === property) {
return properties[i];
}
}

return null;
}


function getMetaPropertyFromExportsNode(exportsNode) {
return getPropertyFromObject("meta", exportsNode);
}


function hasMetaDocs(metaPropertyNode) {
return Boolean(getPropertyFromObject("docs", metaPropertyNode.value));
}


function hasMetaDocsDescription(metaPropertyNode) {
const metaDocs = getPropertyFromObject("docs", metaPropertyNode.value);

return metaDocs && getPropertyFromObject("description", metaDocs.value);
}


function hasMetaDocsCategory(metaPropertyNode) {
const metaDocs = getPropertyFromObject("docs", metaPropertyNode.value);

return metaDocs && getPropertyFromObject("category", metaDocs.value);
}


function hasMetaDocsRecommended(metaPropertyNode) {
const metaDocs = getPropertyFromObject("docs", metaPropertyNode.value);

return metaDocs && getPropertyFromObject("recommended", metaDocs.value);
}


function hasMetaSchema(metaPropertyNode) {
return getPropertyFromObject("schema", metaPropertyNode.value);
}


function checkMetaValidity(context, exportsNode) {
const metaProperty = getMetaPropertyFromExportsNode(exportsNode);

if (!metaProperty) {
context.report(exportsNode, "Rule is missing a meta property.");
return;
}

if (!hasMetaDocs(metaProperty)) {
context.report(metaProperty, "Rule is missing a meta.docs property.");
return;
}

if (!hasMetaDocsDescription(metaProperty)) {
context.report(metaProperty, "Rule is missing a meta.docs.description property.");
return;
}

if (!hasMetaDocsCategory(metaProperty)) {
context.report(metaProperty, "Rule is missing a meta.docs.category property.");
return;
}

if (!hasMetaDocsRecommended(metaProperty)) {
context.report(metaProperty, "Rule is missing a meta.docs.recommended property.");
return;
}

if (!hasMetaSchema(metaProperty)) {
context.report(metaProperty, "Rule is missing a meta.schema property.");
}
}


function isCorrectExportsFormat(node) {
return node.type === "ObjectExpression";
}





module.exports = {
meta: {
docs: {
description: "enforce correct use of `meta` property in core rules",
category: "Internal",
recommended: false
},

schema: []
},

create(context) {
let exportsNode;

return {
AssignmentExpression(node) {
if (node.left &&
node.right &&
node.left.type === "MemberExpression" &&
node.left.object.name === "module" &&
node.left.property.name === "exports") {

exportsNode = node.right;
}
},

"Program:exit"() {
if (!isCorrectExportsFormat(exportsNode)) {
context.report({ node: exportsNode, message: "Rule does not export an Object. Make sure the rule follows the new rule format." });
return;
}

checkMetaValidity(context, exportsNode);
}
};
}
};
