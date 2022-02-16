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

var showPrompt = function() {
rli.write(colors.NYAN);
rli.prompt();
};

this.onKeypress = function(key) {
if (!currentOptions || !key) {
return;
}

if (key.name === 'tab' || key.name === 'right' || key.name === 'down') {
