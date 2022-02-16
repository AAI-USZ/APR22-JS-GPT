var readline = require('readline');
var fs = require('fs');
var util = require('./util');
var path = require('path');
var launcher = require('./launcher');
var logger = require('./logger');
var log = logger.create('init');
var glob = require('glob');
var CONFIG_TPL_PATH = __dirname + '/../config.template';


var COLORS_ON = {
END: '\x1B[39m',
NYAN: '\x1B[36m',
GREEN: '\x1B[32m',
BOLD: '\x1B[1m',
bold: function(str) {
return this.BOLD + str + '\x1B[22m';
},
green: function(str) {
return this.GREEN + str + this.END;
}
};


var COLORS_OFF = {
END: '',
NYAN: '',
GREEN: '',
BOLD: '',
bold: function(str) {
return str;
},
green: function(str) {
return str;
}
};



var colors = COLORS_ON;



var StateMachine = function(rli) {
var currentQuestion;
var answers;
var currentOptions;
var currentOptionsPointer;
var pendingQuestionId;
var done;

this.onKeypress = function(key) {
if (!currentOptions || !key) {
return;
}

if (key.name === 'tab' || key.name === 'right' || key.name === 'down') {
this.suggestNextOption();
} else if (key.name === 'left' || key.name === 'up') {
currentOptionsPointer = currentOptionsPointer + currentOptions.length - 2;
this.suggestNextOption();
}

if (!key.ctrl && !key.meta && key.name !== 'enter') {
key.name = 'escape';
}
};

this.suggestNextOption = function() {
if (!currentOptions) {
return;
}

currentOptionsPointer = (currentOptionsPointer + 1) % currentOptions.length;
rli._deleteLineLeft();
rli._deleteLineRight();
rli.write(currentOptions[currentOptionsPointer]);
};


this.onLine = function(line) {
if (pendingQuestionId) {
if (currentOptions) {
currentOptionsPointer = currentOptions.indexOf(line);
if (currentOptionsPointer === -1) {
return;
}
}

if (line && currentQuestion.validate) {
currentQuestion.validate(line);
}

if (currentQuestion.multiple) {
answers[pendingQuestionId] = answers[pendingQuestionId] || [];
if (line) {
answers[pendingQuestionId].push(line);
rli.prompt();

if (currentOptions) {
currentOptions.splice(currentOptionsPointer, 1);
currentOptionsPointer = -1;
}
} else {
this.nextQuestion();
}
} else {
answers[pendingQuestionId] = line;
this.nextQuestion();
}
}
};

this.nextQuestion = function() {
rli.write(colors.END);
currentQuestion = questions.shift();

while (currentQuestion && currentQuestion.condition && !currentQuestion.condition(answers)) {
currentQuestion = questions.shift();
}

if (currentQuestion) {
pendingQuestionId = null;

rli.write('\n' + colors.bold(currentQuestion.question) + '\n');
rli.write(currentQuestion.hint + colors.NYAN + '\n');

