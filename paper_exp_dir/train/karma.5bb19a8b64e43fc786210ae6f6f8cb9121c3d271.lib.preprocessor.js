'use strict'

const util = require('util')
const fs = require('graceful-fs')

const readFile = util.promisify(fs.readFile.bind(fs))
const tryToRead = function (path, log) {
const maxRetries = 3
let promise = readFile(path)
for (let retryCount = 1; retryCount <= maxRetries; retryCount++) {
promise = promise.catch((err) => {
log.warn(err)
log.warn('retrying ' + retryCount)
return readFile(path)
})
}
return promise.catch((err) => {
log.warn(err)
return Promise.reject(err)
})
}

const mm = require('minimatch')
const { isBinaryFile } = require('isbinaryfile')
const _ = require('lodash')
const CryptoUtils = require('./utils/crypto-utils')

const log = require('./logger').create('preprocess')

function executeProcessor (process, file, content) {
let done = null
const donePromise = new Promise((resolve, reject) => {
done = function (error, content) {

if (arguments.length === 1 && typeof error === 'string') {
content = error
error = null
}
if (error) {
reject(error)
} else {
resolve(content)
}
}
})

return (process(content, file, done) || Promise.resolve()).then((content) => {
if (content) {

return content
}

return donePromise
})
}

async function runProcessors (preprocessors, file, content) {
try {
for (const process of preprocessors) {
content = await executeProcessor(process, file, content)
}
} catch (error) {
file.contentPath = null
file.content = null
throw error
}

file.contentPath = null
file.content = content
file.sha = CryptoUtils.sha1(content)
}

function createPriorityPreprocessor (config = {}, preprocessorPriority, basePath, injector) {
const emitter = injector.get('emitter')
const instances = new Map()

function instantiatePreprocessor (name) {
if (instances.has(name)) {
return instances.get(name)
}

let p
try {
p = injector.get('preprocessor:' + name)
if (!p) {
log.error(`Failed to instantiate preprocessor ${name}`)
emitter.emit('load_error', 'preprocessor', name)
}
} catch (e) {
if (e.message.includes(`No provider for "preprocessor:${name}"`)) {
log.error(`Can not load "${name}", it is not registered!\n  Perhaps you are missing some plugin?`)
} else {
log.error(`Can not load "${name}"!\n  ` + e.stack)
}
emitter.emit('load_error', 'preprocessor', name)
}

instances.set(name, p)
return p
}
_.union.apply(_, Object.values(config)).forEach(instantiatePreprocessor)

return async function preprocess (file) {
const buffer = await tryToRead(file.originalPath, log)
let isBinary = file.isBinary
if (isBinary == null) {

isBinary = await isBinaryFile(buffer, buffer.length)
}

const preprocessorNames = Object.keys(config).reduce((ppNames, pattern) => {
if (mm(file.originalPath, pattern, { dot: true })) {
ppNames = _.union(ppNames, config[pattern])
}
return ppNames
}, [])


const preprocessors = preprocessorNames
.map((name) => [name, preprocessorPriority[name] || 0])
.sort((a, b) => b[1] - a[1])
.map((duo) => duo[0])
.reduce((preProcs, name) => {
const p = instantiatePreprocessor(name)

if (!isBinary || (p && p.handleBinaryFiles)) {
preProcs.push(p)
} else {
log.warn(`Ignored preprocessing ${file.originalPath} because ${name} has handleBinaryFiles=false.`)
}
return preProcs
}, [])

await runProcessors(preprocessors, file, isBinary ? buffer : buffer.toString())
}
}

createPriorityPreprocessor.$inject = ['config.preprocessors', 'config.preprocessor_priority', 'config.basePath', 'injector']
exports.createPriorityPreprocessor = createPriorityPreprocessor
