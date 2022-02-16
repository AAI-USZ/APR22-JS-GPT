

"use strict";





module.exports = (text, data) => {
if (!data) {
return text;
}


return text.replace(/\{\{([^{}]+?)\}\}/gu, (fullMatch, termWithWhitespace) => {
const term = termWithWhitespace.trim();

if (term in data) {
return data[term];
}


return fullMatch;
});
};
