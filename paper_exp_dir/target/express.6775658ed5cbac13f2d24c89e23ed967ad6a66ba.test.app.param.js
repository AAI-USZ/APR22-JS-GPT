it('should support altering req.params across routes', function(done) {
app.param('user', function(req, res, next, user) {
req.params.user = 'loki';
