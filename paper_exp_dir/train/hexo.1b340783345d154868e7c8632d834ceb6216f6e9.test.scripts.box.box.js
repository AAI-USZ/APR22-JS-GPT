var should = require('chai').should();
var pathFn = require('path');
var fs = require('hexo-fs');
var Promise = require('bluebird');
var crypto = require('crypto');

function wait(ms){
return new Promise(function(resolve, reject){
setTimeout(function(){
resolve();
}, ms);
});
}
