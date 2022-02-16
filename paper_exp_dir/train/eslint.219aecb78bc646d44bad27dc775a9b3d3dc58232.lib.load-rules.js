

"use strict";





const fs = require("fs"),
path = require("path");

const rulesDirCache = {};






module.exports = function(relativeRulesDir, cwd) {
const rulesDir = path.resolve(cwd, relativeRulesDir);


if (rulesDirCache[rulesDir]) {
return rulesDirCache[rulesDir];
}

const rules = Object.create(null);

fs.readdirSync(rulesDir).forEach(file => {
if (path.extname(file) !== ".js") {
return;
}
rules[file.slice(0, -3)] = require(path.join(rulesDir, file));
});
rulesDirCache[rulesDir] = rules;

return rules;
};
