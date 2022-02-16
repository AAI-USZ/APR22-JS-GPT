'use strict'
const PathUtils = require('./path-utils')
const fs = require('fs')

const BundleUtils = {
bundleResource (inPath, outPath) {
return new Promise((resolve, reject) => {
require('browserify')(inPath)
.bundle()
.pipe(fs.createWriteStream(outPath))
.once('finish', () => resolve())
.once('error', (e) => reject(e))
})
