


var express = require('express')
, connect = require('connect')
, assert = require('assert')
, should = require('should')
, Route = express.Route;

module.exports = {
'test route middleware': function(beforeExit){
var app = express.createServer()
, calls = 0;

function allow(role) {
return function(req, res, next) {


if (req.headers['x-role'] == role) {
next();
} else {
