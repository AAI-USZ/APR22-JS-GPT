utils.etag(str).should.eql('W/"9-2260508953"');
utils.etag(strUTF8, 'utf8').should.eql('W/"4d-1395090196"');
utils.etag(new Buffer(strUTF8, 'utf8')).should.eql('W/"4d-1395090196"');
