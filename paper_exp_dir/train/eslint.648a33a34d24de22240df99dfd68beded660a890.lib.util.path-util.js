
"use strict";





const path = require("path");






function convertPathToPosix(filepath) {
const normalizedFilepath = path.normalize(filepath);
const posixFilepath = normalizedFilepath.replace(/\\/g, "/");

return posixFilepath;
}


function getRelativePath(filepath, baseDir) {
const absolutePath = path.isAbsolute(filepath)
? filepath
: path.resolve(filepath);

if (baseDir) {
if (!path.isAbsolute(baseDir)) {
throw new Error("baseDir should be an absolute path");
}
return path.relative(baseDir, absolutePath);
}
return absolutePath.replace(/^\

}





module.exports = {
convertPathToPosix,
getRelativePath
};
