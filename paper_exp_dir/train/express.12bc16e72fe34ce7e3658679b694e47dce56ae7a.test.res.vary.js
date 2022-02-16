
var assert = require('assert');
var express = require('..');
var request = require('supertest');
var utils = require('./support/utils');

describe('res.vary()', function(){
describe('with no arguments', function(){
it('should not set Vary', function (done) {
var app = express();

app.use(function (req, res) {
res.vary();
res.end();
