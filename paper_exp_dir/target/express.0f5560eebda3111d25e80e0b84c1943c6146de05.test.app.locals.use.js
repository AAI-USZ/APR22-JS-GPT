.end(function(err, res){
if (err) return done(err);
calls.should.eql(['use', 'one', 'two']);
