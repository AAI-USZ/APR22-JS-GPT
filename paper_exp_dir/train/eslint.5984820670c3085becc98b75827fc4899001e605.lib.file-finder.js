

"use strict";





const fs = require("fs"),
path = require("path");






function getDirectoryEntries(directory) {
try {

return fs.readdirSync(directory);
} catch (ex) {
return [];
}
}


function normalizeDirectoryEntries(entries, directory, supportedConfigs) {
const fileHash = {};

entries.forEach(entry => {
if (supportedConfigs.indexOf(entry) >= 0) {
const resolvedEntry = path.resolve(directory, entry);

if (fs.statSync(resolvedEntry).isFile()) {
fileHash[entry] = resolvedEntry;
}
}
});
return fileHash;
}






class FileFinder {


constructor(files, cwd) {
this.fileNames = Array.isArray(files) ? files : [files];
this.cwd = cwd || process.cwd();
this.cache = {};
}


*findAllInDirectoryAndParents(relativeDirectory) {
const cache = this.cache;

const initialDirectory = relativeDirectory
? path.resolve(this.cwd, relativeDirectory)
: this.cwd;

if (cache.hasOwnProperty(initialDirectory)) {
yield* cache[initialDirectory];
return;
}

const dirs = [];
const fileNames = this.fileNames;
let searched = 0;
let directory = initialDirectory;

do {
dirs[searched++] = directory;
cache[directory] = [];

const filesMap = normalizeDirectoryEntries(getDirectoryEntries(directory), directory, fileNames);

if (Object.keys(filesMap).length) {
for (let k = 0; k < fileNames.length; k++) {

if (filesMap[fileNames[k]]) {
const filePath = filesMap[fileNames[k]];


for (let j = 0; j < searched; j++) {
cache[dirs[j]].push(filePath);
}
yield filePath;
break;
}
}
}

const child = directory;


directory = path.dirname(directory);

if (directory === child) {
return;
}

} while (!cache.hasOwnProperty(directory));


for (let i = 0; i < searched; i++) {
cache[dirs[i]].push(...cache[directory]);
}

yield* cache[dirs[0]];
}
}

module.exports = FileFinder;
