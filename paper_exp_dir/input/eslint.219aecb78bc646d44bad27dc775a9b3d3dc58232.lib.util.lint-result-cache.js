
"use strict";





const assert = require("assert");
const fs = require("fs");
const fileEntryCache = require("file-entry-cache");
const stringify = require("json-stable-stringify-without-jsonify");
const pkg = require("../../package.json");
const hash = require("./hash");





const configHashCache = new WeakMap();


function hashOfConfigFor(config) {
if (!configHashCache.has(config)) {
configHashCache.set(config, hash(`${pkg.version}_${stringify(config)}`));
}

return configHashCache.get(config);
}






class LintResultCache {


constructor(cacheFileLocation) {
assert(cacheFileLocation, "Cache file location is required");

this.fileEntryCache = fileEntryCache.create(cacheFileLocation);
}


getCachedLintResults(filePath, config) {



const fileDescriptor = this.fileEntryCache.getFileDescriptor(filePath);
const hashOfConfig = hashOfConfigFor(config);
const changed = fileDescriptor.changed || fileDescriptor.meta.hashOfConfig !== hashOfConfig;

if (fileDescriptor.notFound || changed) {
return null;
}


if (fileDescriptor.meta.results && fileDescriptor.meta.results.source === null) {
fileDescriptor.meta.results.source = fs.readFileSync(filePath, "utf-8");
}

return fileDescriptor.meta.results;
}


setCachedLintResults(filePath, config, result) {
if (result && Object.prototype.hasOwnProperty.call(result, "output")) {
return;
}

const fileDescriptor = this.fileEntryCache.getFileDescriptor(filePath);

if (fileDescriptor && !fileDescriptor.notFound) {


const resultToSerialize = Object.assign({}, result);


if (Object.prototype.hasOwnProperty.call(resultToSerialize, "source")) {
resultToSerialize.source = null;
}

fileDescriptor.meta.results = resultToSerialize;
fileDescriptor.meta.hashOfConfig = hashOfConfigFor(config);
}
}


reconcile() {
this.fileEntryCache.reconcile();
}
}

module.exports = LintResultCache;
