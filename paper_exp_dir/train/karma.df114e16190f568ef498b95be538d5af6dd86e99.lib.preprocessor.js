'use strict'

const fs = require('graceful-fs')
const mm = require('minimatch')
const isBinaryFile = require('isbinaryfile')
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
return process(content, file, done) || donePromise
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

function createPriorityPreprocessor (config, preprocessorPriority, basePath, injector) {
const emitter = injector.get('emitter')
const alreadyDisplayedErrors = {}
const instances = {}
let patterns = Object.keys(config)

function instantiatePreprocessor (name) {
if (alreadyDisplayedErrors[name]) {
return
}

let p = instances[name]
if (p) {
return p
}

try {
p = injector.get('preprocessor:' + name)
} catch (e) {
if (e.message.includes(`No provider for "preprocessor:${name}"`)) {
log.error(`Can not load "${name}", it is not registered!\n  Perhaps you are missing some plugin?`)
