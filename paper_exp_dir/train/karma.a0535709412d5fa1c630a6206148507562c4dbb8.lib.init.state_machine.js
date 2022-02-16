'use strict'

const logQueue = require('./log-queue')

var questions
var currentQuestion
var answers
var currentOptions
var currentOptionsPointer
var currentQuestionId
var done

class StateMachine {
constructor (rli, colors) {
this.rli = rli
this.colors = colors
}

