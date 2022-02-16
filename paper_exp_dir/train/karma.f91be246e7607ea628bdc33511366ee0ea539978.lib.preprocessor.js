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

return (process(content, file, done) || Promise.resolve()).then((content) => {
if (content) {

return content
}

return donePromise
})
}
