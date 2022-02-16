var util = require('util');
var EventEmitter = require('events').EventEmitter;

var StateMachine = function(rli, colors) {
var questions;
var currentQuestion;
var answers;
var currentOptions;
var currentOptionsPointer;
var currentQuestionId;
var done;

EventEmitter.call(this);

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

if (!key.ctrl && !key.meta && key.name !== 'enter' && key.name !== 'return') {
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
if (currentQuestionId) {
line = line.trim();

if (currentOptions) {
currentOptionsPointer = currentOptions.indexOf(line);
if (currentOptionsPointer === -1) {
return;
}
}

if (line === '') {
line = null;
}

if (currentQuestion.boolean) {
line = (line === 'yes' || line === 'true' || line === 'on');
}

if (line !== null && currentQuestion.validate) {
currentQuestion.validate(line);
}

if (currentQuestion.multiple) {
answers[currentQuestionId] = answers[currentQuestionId] || [];
if (line !== null) {
answers[currentQuestionId].push(line);
rli.prompt();

if (currentOptions) {
currentOptions.splice(currentOptionsPointer, 1);
currentOptionsPointer = -1;
}
} else {
this.nextQuestion();
}
} else {
answers[currentQuestionId] = line;
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

this.emit('next_question', currentQuestion);

if (currentQuestion) {
currentQuestionId = null;

rli.write('\n' + colors.bold(currentQuestion.question) + '\n');
rli.write(currentQuestion.hint + colors.NYAN + '\n');

currentOptions = currentQuestion.options || null;
currentOptionsPointer = -1;
currentQuestionId = currentQuestion.id;
rli.prompt();

this.suggestNextOption();
} else {
currentQuestionId = null;
currentOptions = null;


done(answers);
}
};

this.process = function(_questions, _done) {
questions = _questions;
answers = {};
done = _done;

this.nextQuestion();
};
};

util.inherits(StateMachine, EventEmitter);


module.exports = StateMachine;
