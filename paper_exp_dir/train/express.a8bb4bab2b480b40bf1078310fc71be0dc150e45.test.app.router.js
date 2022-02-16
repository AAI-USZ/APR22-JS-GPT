
var express = require('../')
, request = require('supertest')
, assert = require('assert')
, methods = require('methods');

describe('app.router', function(){
describe('methods supported', function(){
methods.concat('del').forEach(function(method){
if (method === 'connect') return;

it('should include ' + method.toUpperCase(), function(done){
var app = express();
var calls = [];

app[method]('/foo', function(req, res){
if ('head' == method) {
