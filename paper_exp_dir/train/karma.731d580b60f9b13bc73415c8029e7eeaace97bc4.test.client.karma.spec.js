var sinon = require('sinon');
var chai = require('chai');
chai.use(require('sinon-chai'));
var expect = chai.expect

var Karma  = require('../../client/karma');
var MockSocket = require('./mocks').Socket;


describe('Karma', function() {
