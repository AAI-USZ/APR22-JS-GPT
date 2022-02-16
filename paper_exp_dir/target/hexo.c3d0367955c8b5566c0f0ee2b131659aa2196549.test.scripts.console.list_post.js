expect(console.log.calledWith(sinon.match('Date'))).be.true;
expect(console.log.calledWith(sinon.match('Title'))).be.true;
expect(console.log.calledWith(sinon.match('Path'))).be.true;
