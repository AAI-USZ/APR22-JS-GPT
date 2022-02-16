'use strict';

var Promise = require('bluebird');

function Generator(){
this.id = 0;
this.store = {};
}

Generator.prototype.list = function(){
return this.store;
