formatError = m.createErrorFormatter({ basePath: '', hostname: 'localhost', port: 8080 }, emitter)
it('should remove specified hostname from files', () => {
expect(formatError('file http://localhost:8080/base/usr/a.js and http://127.0.0.1:8080/absolute/home/b.js')).to.be.equal('file usr/a.js and http://127.0.0.1:8080/home/b.js\n')
