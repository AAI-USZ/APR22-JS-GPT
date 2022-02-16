
var after = require('after');
var express = require('../')
, request = require('supertest')
, assert = require('assert');
var path = require('path');
var should = require('should');
var fixtures = path.join(__dirname, 'fixtures');

describe('res', function(){
describe('.sendFile(path)', function () {
