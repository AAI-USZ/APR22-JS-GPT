var async = require('async'),
domain = require('domain'),
HexoError = require('../error'),
ExtendError = HexoError.ExtendError;



var Filter = module.exports = function(){


this.store = {};
};


