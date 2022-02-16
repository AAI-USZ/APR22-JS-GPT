'use strict';

var EventEmitter = require('events').EventEmitter;
var Promise = require('bluebird');
var Readable = require('stream').Readable;
var util = require('util');

function Router(){
EventEmitter.call(this);

