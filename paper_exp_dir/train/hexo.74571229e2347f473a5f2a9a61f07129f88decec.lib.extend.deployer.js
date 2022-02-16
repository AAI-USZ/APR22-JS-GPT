'use strict';

var Promise = require('bluebird');

function Deployer(){
this.store = {};
}

Deployer.prototype.list = function(){
return this.store;
};
