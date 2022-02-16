'use strict';

var Promise = require('bluebird');

function Migrator(){
this.store = {};
}

Migrator.prototype.list = function(){
return this.store;
};
