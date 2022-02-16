var path = require('path');
var expect = require('expect.js');
var _s = require('underscore.string');
var bowerJson = require('../lib/json');

describe('.find', function () {
    it('should find the bower.json file', function (done) {
        bowerJson.find(__dirname + '/pkg-bower-json', function (err, file) {
            if (err) {
                return done(err);
            }

            expect(file).to.equal(path.resolve(__dirname + '/pkg-bower-json/bower.json'));
            done();
        });
    });

    it('should fallback to the component.json file', function (done) {
        bowerJson.find(__dirname + '/pkg-component-json', function (err, file) {
            if (err) {
                return done(err);
            }

            expect(file).to.equal(path.resolve(__dirname + '/pkg-component-json/component.json'));
            done();
        });
    });

    it('should not fallback to the component.json file if it\'s a component(1) file', function (done) {
        bowerJson.find(__dirname + '/pkg-component(1)-json', function (err) {
            expect(err).to.be.an(Error);
            expect(err.code).to.equal('ENOENT');
            expect(err.message).to.equal('None of bower.json, component.json, .bower.json were found in ' + __dirname + '/pkg-component(1)-json');
            done();
        });
    });

    it('should fallback to the .bower.json file', function (done) {
        bowerJson.find(__dirname + '/pkg-dot-bower-json', function (err, file) {
            if (err) {
                return done(err);
            }

            expect(file).to.equal(path.resolve(__dirname + '/pkg-dot-bower-json/.bower.json'));
            done();
        });
    });

    it('should error if no component.json / bower.json / .bower.json is found', function (done) {
        bowerJson.find(__dirname, function (err) {
            expect(err).to.be.an(Error);
            expect(err.code).to.equal('ENOENT');
            expect(err.message).to.equal('None of bower.json, component.json, .bower.json were found in ' + __dirname);
            done();
        });
    });
});

describe('.read', function () {
    it('should give error if file does not exists', function (done) {
        bowerJson.read(__dirname + '/willneverexist', function (err) {
            expect(err).to.be.an(Error);
            expect(err.code).to.equal('ENOENT');
            done();
        });
    });

    it('should give error if when reading an invalid json', function (done) {
        bowerJson.read(__dirname + '/pkg-bower-json-malformed/bower.json', function (err) {
            expect(err).to.be.an(Error);
            expect(err.code).to.equal('EMALFORMED');
            expect(err.file).to.equal(path.resolve(__dirname + '/pkg-bower-json-malformed/bower.json'));
            done();
        });
    });

    it('should read the file and give an object', function (done) {
        bowerJson.read(__dirname + '/pkg-bower-json/bower.json', function (err, json) {
            if (err) {
                return done(err);
            }

            expect(json).to.be.an('object');
            expect(json.name).to.equal('some-pkg');
            expect(json.version).to.equal('0.0.0');

            done();
        });
    });

    it('should give the json file that was read', function (done) {
        bowerJson.read(__dirname + '/pkg-bower-json', function (err, json, file) {
            if (err) {
                return done(err);
            }


            expect(file).to.equal(__dirname + '/pkg-bower-json/bower.json');
            done();
        });
    });

    it('should find for a json file if a directory is given', function (done) {
        bowerJson.read(__dirname + '/pkg-component-json', function (err, json, file) {
            if (err) {
                return done(err);
            }

            expect(json).to.be.an('object');
            expect(json.name).to.equal('some-pkg');
            expect(json.version).to.equal('0.0.0');
            expect(file).to.equal(path.resolve(__dirname + '/pkg-component-json/component.json'));
            done();
        });
    });

    it('should validate the returned object unless validate is false', function (done) {
        bowerJson.read(__dirname + '/pkg-bower-json-invalid/bower.json', function (err) {
            expect(err).to.be.an(Error);
            expect(err.message).to.contain('name');
            expect(err.file).to.equal(path.resolve(__dirname + '/pkg-bower-json-invalid/bower.json'));

            bowerJson.read(__dirname + '/pkg-bower-json-invalid/bower.json', { validate: false }, function (err) {
                done(err);
            });
        });
    });

    it('should normalize the returned object if normalize is true', function (done) {
        bowerJson.read(__dirname + '/pkg-bower-json/bower.json', function (err, json) {
            if (err) {
                return done(err);
            }

            expect(json.main).to.equal('foo.js');

            bowerJson.read(__dirname + '/pkg-bower-json/bower.json', { normalize: true }, function (err, json) {
                if (err) {
                    return done(err);
                }

                expect(json.main).to.eql(['foo.js']);
                done();
            });
        });
    });
});

describe('.parse', function () {
    it('should return the same object, unless clone is true', function () {
        var json = { name: 'foo' };

        expect(bowerJson.parse(json)).to.equal(json);
        expect(bowerJson.parse(json, { clone: true })).to.not.equal(json);
        expect(bowerJson.parse(json, { clone: true })).to.eql(json);
    });

    it('should validate the passed object, unless validate is false', function () {
        expect(function () {
            bowerJson.parse({});
        }).to.throwException(/name/);

        expect(function () {
            bowerJson.parse({}, { validate: false });
        }).to.not.throwException();
    });

    it('should not normalize the passed object unless normalize is true', function () {
        var json = { name: 'foo', main: 'foo.js' };

        bowerJson.parse(json);
        expect(json.main).to.eql('foo.js');

        bowerJson.parse(json, { normalize: true });
        expect(json.main).to.eql(['foo.js']);
    });
});

describe('.validate', function () {
    it('should validate the name property', function () {
        expect(function () {
            bowerJson.validate({});
        }).to.throwException(/name/);
    });

    it('should validate the name length', function () {
        var json = { name: 'a_123456789_123456789_123456789_123456789_123456789_z' };
        expect(function () {
            bowerJson.validate(json);
        }).to.throwException();
    });
    it('should validate the name is lowercase', function () {
        var json = { name: 'gruNt' };
        expect(function () {
            bowerJson.validate(json);
        }).to.throwException();
    });
    it('should validate the name starts with lowercase', function () {
        var json = { name: 'Grunt' };
        expect(function () {
            bowerJson.validate(json);
        }).to.throwException();
    });
    it('should validate the name starts with lowercase', function () {
        var json = { name: '.grunt' };
        expect(function () {
            bowerJson.validate(json);
        }).to.throwException();
    });
    it('should validate the name ends with lowercase', function () {
        var json = { name: 'grunT' };
        expect(function () {
            bowerJson.validate(json);
        }).to.throwException();
    });
    it('should validate the name ends with lowercase', function () {
        var json = { name: 'grun.' };
        expect(function () {
            bowerJson.validate(json);
        }).to.throwException();
    });
    it('should validate the name is valid', function () {
        var json = { name: 'gru.n-t' };
        expect(function () {
            bowerJson.validate(json);
        }).to.not.throwException();
    });
    it('should validate the description length', function () {
        var json = {
            name: 'foo',
            description: _s.repeat('æ', 141)
        };
        expect(function () {
            bowerJson.validate(json);
        }).to.throwException();
    });
    it('should validate the description is valid', function () {
        var json = {
            name: 'foo',
            description: _s.repeat('æ', 140)
        };
        expect(function () {
            bowerJson.validate(json);
        }).to.not.throwException();
    });
    it('should validate the type of main', function () {
        var json = {
            name: 'foo',
            main: {}
        };
        expect(function () {
            bowerJson.validate(json);
        }).to.throwException();
    });
    it('should validate the type of items of an Array main', function () {
        var json = {
            name: 'foo',
            main: [{}]
        };
        expect(function () {
            bowerJson.validate(json);
        }).to.throwException();
    });
    it('should validate that main does not contain globs', function () {
        var json = {
            name: 'foo',
            main: ['js/*.js']
        };
        expect(function () {
            bowerJson.validate(json);
        }).to.throwException();
    });
    it('should validate that main does not contain minified files', function () {
        expect(function () {
            bowerJson.validate(json);
        }).to.throwException();
        var json = {
            name: 'foo',
            main: ['foo.min.css']
        };
    });
    it('should validate that main does not contain fonts', function () {
        var json = {
            name: 'foo',
            main: ['foo.woff']
        };
        expect(function () {
            bowerJson.validate(json);
        }).to.throwException();
    });
    it('should validate that main does not contain images', function () {
        var json = {
            name: 'foo',
            main: ['foo.png']
        };
        expect(function () {
            bowerJson.validate(json);
        }).to.throwException();
    });
    it('should validate that main does not contain multiple files of the same filetype', function () {
        var json = {
            name: 'foo',
            main: ['foo.js', 'bar.js']
        };
        expect(function () {
            bowerJson.validate(json);
        }).to.throwException();
    });
});

describe('.normalize', function () {
    it('should normalize the main property', function () {
        var json = { name: 'foo', main: 'foo.js' };

        bowerJson.normalize(json);
        expect(json.main).to.eql(['foo.js']);
    });
});
