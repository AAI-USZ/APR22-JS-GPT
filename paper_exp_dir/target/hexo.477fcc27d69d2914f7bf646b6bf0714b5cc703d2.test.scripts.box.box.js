for (const [key, item] of Object.entries(data)) {
item.path.should.eql(key);
item.source.should.eql(join(box.base, key));
