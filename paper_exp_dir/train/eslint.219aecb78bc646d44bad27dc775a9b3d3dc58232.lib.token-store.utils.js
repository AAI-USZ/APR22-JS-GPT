
"use strict";





const lodash = require("lodash");






function getStartLocation(token) {
return token.range[0];
}






exports.search = function search(tokens, location) {
return lodash.sortedIndexBy(
tokens,
{ range: [location] },
getStartLocation
);
};


exports.getFirstIndex = function getFirstIndex(tokens, indexMap, startLoc) {
if (startLoc in indexMap) {
return indexMap[startLoc];
}
if ((startLoc - 1) in indexMap) {
const index = indexMap[startLoc - 1];
const token = (index >= 0 && index < tokens.length) ? tokens[index] : null;


if (token && token.range[0] >= startLoc) {
return index;
}
return index + 1;
}
return 0;
};


exports.getLastIndex = function getLastIndex(tokens, indexMap, endLoc) {
if (endLoc in indexMap) {
return indexMap[endLoc] - 1;
}
if ((endLoc - 1) in indexMap) {
const index = indexMap[endLoc - 1];
const token = (index >= 0 && index < tokens.length) ? tokens[index] : null;


if (token && token.range[1] > endLoc) {
return index - 1;
}
return index;
}
return tokens.length - 1;
};
