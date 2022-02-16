postLink([]).should.eql('<a href="#">Post not found: Invalid post_link</a>');
postLink(['bar']).should.eql('<a href="#">Post not found: Invalid post_link</a>');
