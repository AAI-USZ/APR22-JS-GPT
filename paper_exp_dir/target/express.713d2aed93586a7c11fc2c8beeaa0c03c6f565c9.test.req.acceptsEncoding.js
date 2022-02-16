req.acceptsEncoding('gzip').should.be.ok()
req.acceptsEncoding('deflate').should.be.ok()
req.acceptsEncoding('bogus').should.not.be.ok()
