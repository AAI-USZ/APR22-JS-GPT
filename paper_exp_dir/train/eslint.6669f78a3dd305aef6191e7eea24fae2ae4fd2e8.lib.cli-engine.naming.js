
"use strict";

const NAMESPACE_REGEX = /^@.*\


function normalizePackageName(name, prefix) {
let normalizedName = name;


if (normalizedName.includes("\\")) {
normalizedName = normalizedName.replace(/\\/gu, "/");
}

if (normalizedName.charAt(0) === "@") {


const scopedPackageShortcutRegex = new RegExp(`^(@[^/]+)(?:/(?:${prefix})?)?$`, "u"),
scopedPackageNameRegex = new RegExp(`^${prefix}(-|$)`, "u");

if (scopedPackageShortcutRegex.test(normalizedName)) {
normalizedName = normalizedName.replace(scopedPackageShortcutRegex, `$1/${prefix}`);
} else if (!scopedPackageNameRegex.test(normalizedName.split("/")[1])) {


normalizedName = normalizedName.replace(/^@([^/]+)\/(.*)$/u, `@$1/${prefix}-$2`);
}
} else if (!normalizedName.startsWith(`${prefix}-`)) {
normalizedName = `${prefix}-${normalizedName}`;
}

return normalizedName;
}


function getShorthandName(fullname, prefix) {
if (fullname[0] === "@") {
let matchResult = new RegExp(`^(@[^/]+)/${prefix}$`, "u").exec(fullname);

if (matchResult) {
return matchResult[1];
}

matchResult = new RegExp(`^(@[^/]+)/${prefix}-(.+)$`, "u").exec(fullname);
if (matchResult) {
return `${matchResult[1]}/${matchResult[2]}`;
}
} else if (fullname.startsWith(`${prefix}-`)) {
return fullname.slice(prefix.length + 1);
}

return fullname;
}


function getNamespaceFromTerm(term) {
const match = term.match(NAMESPACE_REGEX);

return match ? match[0] : "";
}





module.exports = {
normalizePackageName,
getShorthandName,
getNamespaceFromTerm
};
