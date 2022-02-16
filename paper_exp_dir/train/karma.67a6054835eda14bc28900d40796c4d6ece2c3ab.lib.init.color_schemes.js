var COLORS_ON = {
RESET: '\x1B[39m',
ANSWER: '\x1B[36m',
SUCCESS: '\x1B[32m',
QUESTION: '\x1B[1m',
question: function (str) {
return this.QUESTION + str + '\x1B[22m'
},
success: function (str) {
return this.SUCCESS + str + this.RESET
}
}

var COLORS_OFF = {
RESET: '',
ANSWER: '',
SUCCESS: '',
QUESTION: '',
question: function (str) {
return str
},
success: function (str) {
return str
}
}
