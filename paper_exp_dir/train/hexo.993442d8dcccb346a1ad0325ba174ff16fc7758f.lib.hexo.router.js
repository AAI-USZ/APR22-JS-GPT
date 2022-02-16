'use strict';

var EventEmitter = require('events').EventEmitter;
var Promise = require('bluebird');
var Stream = require('stream');
var util = require('util');
var through2 = require('through2');
var Readable = Stream.Readable;

function Router(){
EventEmitter.call(this);

this.routes = {};
}

util.inherits(Router, EventEmitter);
