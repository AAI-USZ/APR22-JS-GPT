var util = require('util')
var EventEmitter = require('events').EventEmitter

var StateMachine = function (rli, colors) {
var questions
var currentQuestion
var answers
var currentOptions
var currentOptionsPointer
var currentQuestionId
var done
