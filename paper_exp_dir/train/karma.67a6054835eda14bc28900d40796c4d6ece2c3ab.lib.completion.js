var CUSTOM = ['']
var BOOLEAN = false

var options = {
start: {
'--port': CUSTOM,
'--auto-watch': BOOLEAN,
'--no-auto-watch': BOOLEAN,
'--log-level': ['disable', 'debug', 'info', 'warn', 'error'],
'--colors': BOOLEAN,
'--no-colors': BOOLEAN,
'--reporters': ['dots', 'progress'],
'--no-reporters': BOOLEAN,
'--browsers': ['Chrome', 'ChromeCanary', 'Firefox', 'PhantomJS', 'Safari', 'Opera'],
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

var parseEnv = function (argv, env) {
var words = argv.slice(5)

return {
words: words,
count: parseInt(env.COMP_CWORD, 10),
last: words[words.length - 1],
prev: words[words.length - 2]
}
}

var opositeWord = function (word) {
if (word.charAt(0) !== '-') {
return null
}

return word.substr(0, 5) === '--no-' ? '--' + word.substr(5) : '--no-' + word.substr(2)
