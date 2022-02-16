expect(console.log.calledWith(sinon.match('Name'))).be.true;
expect(console.log.calledWith(sinon.match('Posts'))).be.true;
expect(console.log.calledWith(sinon.match('Path'))).be.true;
