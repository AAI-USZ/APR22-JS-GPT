
fileStats.dev = (new Uint32Array([fileStats.dev]))[0]
fileStats.should.eql(fs.statSync(file.source));
