'use strict';

var Promise = require('bluebird');
var abbrev = require('abbrev');

function Console(){
this.store = {};
this.alias = {};
}

