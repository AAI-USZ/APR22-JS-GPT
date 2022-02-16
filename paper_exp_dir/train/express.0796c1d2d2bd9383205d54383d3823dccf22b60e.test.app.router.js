
var express = require('../')
, request = require('./support/http')
, assert = require('assert')
, methods = require('methods');

describe('app.router', function(){
describe('methods supported', function(){
methods.forEach(function(method){
if (method === 'connect') return;

it('should include ' + method.toUpperCase(), function(done){
if (method == 'delete') method = 'del';
var app = express();
var calls = [];

app[method]('/foo', function(req, res){
if ('head' == method) {
res.end();
