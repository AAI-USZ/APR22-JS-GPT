

"use strict";

const ALLOWED_FIRST_WORDS = [
"enforce",
"require",
"disallow"
];






function getPropertyFromObject(property, node) {
const properties = node.properties;

for (let i = 0; i < properties.length; i++) {
if (properties[i].key.name === property) {
return properties[i];
}
}

return null;
}


function checkMetaDocsDescription(context, exportsNode) {
if (exportsNode.type !== "ObjectExpression") {


return;
}

const metaProperty = getPropertyFromObject("meta", exportsNode);
const metaDocs = metaProperty && getPropertyFromObject("docs", metaProperty.value);
const metaDocsDescription = metaDocs && getPropertyFromObject("description", metaDocs.value);

if (!metaDocsDescription) {


return;
}

const description = metaDocsDescription.value.value;

if (typeof description !== "string") {
context.report({
node: metaDocsDescription.value,
message: "`meta.docs.description` should be a string."
});
return;
}

if (description === "") {
context.report({
node: metaDocsDescription.value,
message: "`meta.docs.description` should not be empty."
});
return;
}

if (description.indexOf(" ") === 0) {
context.report({
node: metaDocsDescription.value,
message: "`meta.docs.description` should not start with whitespace."
});
return;
}

const firstWord = description.split(" ")[0];

if (ALLOWED_FIRST_WORDS.indexOf(firstWord) === -1) {
context.report({
node: metaDocsDescription.value,
message: "`meta.docs.description` should start with one of the following words: {{ allowedWords }}. Started with \"{{ firstWord }}\" instead.",
data: {
allowedWords: ALLOWED_FIRST_WORDS.join(", "),
firstWord
}
});
}
}





module.exports = {
meta: {
docs: {
description: "enforce correct conventions of `meta.docs.description` property in core rules",
category: "Internal",
recommended: false
},

schema: []
},

create(context) {
return {
AssignmentExpression(node) {
if (node.left &&
node.right &&
node.left.type === "MemberExpression" &&
node.left.object.name === "module" &&
node.left.property.name === "exports") {

checkMetaDocsDescription(context, node.right);
}
}
};
}
};
