const { stub, assert: sinonAssert } = require('sinon');
sinonAssert.calledWithMatch(logStub, 'Name');
sinonAssert.calledWithMatch(logStub, 'Posts');
