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
for (let process of preprocessors) {
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
