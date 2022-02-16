
var assert = require('assert');
var express = require('..');

function req(ret) {
return {
get: function(){ return ret }
, __proto__: express.request
};
}

