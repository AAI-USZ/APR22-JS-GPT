on: sinon.spy((event, callback) => callback && callback(mockServerSocket)),
expect(typeof mockSocketEventListeners.get('error')).to.be.equal('function')
done()
