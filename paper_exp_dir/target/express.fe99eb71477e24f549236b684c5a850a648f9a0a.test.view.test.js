assert.equal('object', typeof res, 'Test dynamic helper res');
assert.ok(this instanceof express.Server, 'Test dynamic helper app scope');
return req.session;
