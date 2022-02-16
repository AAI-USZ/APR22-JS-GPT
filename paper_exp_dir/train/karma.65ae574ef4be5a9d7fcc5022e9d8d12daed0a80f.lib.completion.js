'use strict'

const CUSTOM = ['']
const BOOLEAN = false

const options = {
start: {
'--port': CUSTOM,
'--auto-watch': BOOLEAN,
'--no-auto-watch': BOOLEAN,
'--log-level': ['disable', 'debug', 'info', 'warn', 'error'],
'--colors': BOOLEAN,
'--no-colors': BOOLEAN,
'--reporters': ['dots', 'progress'],
'--no-reporters': BOOLEAN,
'--browsers': ['Chrome', 'ChromeHeadless', 'ChromeCanary', 'Firefox', 'PhantomJS', 'Safari', 'Opera'],
'--no-browsers': BOOLEAN,
'--single-run': BOOLEAN,
'--no-single-run': BOOLEAN,
'--help': BOOLEAN
},
init: {
'--log-level': ['disable', 'debug', 'info', 'warn', 'error'],
'--colors': BOOLEAN,
'--no-colors': BOOLEAN,
'--help': BOOLEAN
},
run: {
'--no-refresh': BOOLEAN,
'--port': CUSTOM,
'--help': BOOLEAN
}
}

function parseEnv (argv, env) {
const words = argv.slice(5)

return {
words: words,
count: parseInt(env.COMP_CWORD, 10),
last: words[words.length - 1],
prev: words[words.length - 2]
}
}

function opositeWord (word) {
if (word.charAt(0) !== '-') {
return null
}

return word.substr(0, 5) === '--no-' ? '--' + word.substr(5) : '--no-' + word.substr(2)
}

function sendCompletionNoOptions () {}

function sendCompletion (possibleWords, env) {
const regexp = new RegExp('^' + env.last)
const filteredWords = possibleWords.filter(function (word) {
return regexp.test(word) && !env.words.includes(word) &&
!env.words.includes(opositeWord(word))
})

if (!filteredWords.length) {
return sendCompletionNoOptions(env)
}

filteredWords.forEach(function (word) {
console.log(word)
})
}

const glob = require('glob')
const globOpts = {
mark: true,
nocase: true
}

function sendCompletionFiles (env) {
glob(env.last + '*', globOpts, function (err, files) {
if (err) return console.error(err)

if (files.length === 1 && files[0].charAt(files[0].length - 1) === '/') {
sendCompletionFiles({last: files[0]})
} else {
console.log(files.join('\n'))
}
})
}

function sendCompletionConfirmLast (env) {
console.log(env.last)
}

function complete (env) {
if (env.count === 1) {
if (env.words[0].charAt(0) === '-') {
return sendCompletion(['--help', '--version'], env)
}

return sendCompletion(Object.keys(options), env)
}

if (env.count === 2 && env.words[1].charAt(0) !== '-') {

return sendCompletionFiles(env)
}

const cmdOptions = options[env.words[0]]
const previousOption = cmdOptions[env.prev]

if (!cmdOptions) {

return sendCompletionNoOptions()
}

if (previousOption === CUSTOM && env.last) {

return sendCompletionConfirmLast(env)
}

if (previousOption) {

return sendCompletion(previousOption, env)
}

return sendCompletion(Object.keys(cmdOptions), env)
}

function completion () {
if (process.argv[3] === '--') {
return complete(parseEnv(process.argv, process.env))
}


const fs = require('graceful-fs')
const path = require('path')

fs.readFile(path.resolve(__dirname, '../scripts/karma-completion.sh'), 'utf8', function (err, data) {
if (err) return console.error(err)

process.stdout.write(data)
process.stdout.on('error', function (error) {










if (error.errno === 'EPIPE') {
error = null
}
})
})
}


exports.completion = completion


exports.opositeWord = opositeWord
exports.sendCompletion = sendCompletion
exports.complete = complete
