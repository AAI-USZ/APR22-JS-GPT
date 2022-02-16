


var express = require('express')
, connect = require('connect')
, assert = require('assert')
, should = require('should')
, MemoryStore = require('connect/middleware/session/memory');


var memoryStore = new MemoryStore({ reapInterval: -1 });

module.exports = {
'test #isXMLHttpRequest': function(){
