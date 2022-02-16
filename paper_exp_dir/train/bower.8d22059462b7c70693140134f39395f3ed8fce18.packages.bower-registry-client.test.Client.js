var RegistryClient = require('../Client'),
expect = require('chai').expect;

describe('RegistryClient', function () {

beforeEach(function () {
this.client = new RegistryClient();
});

describe('Constructor', function () {
