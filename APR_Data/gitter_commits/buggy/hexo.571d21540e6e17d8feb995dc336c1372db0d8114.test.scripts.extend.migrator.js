var should = require('chai').should();

describe('Migrator', function(){
  var Migrator = require('../../../lib/extend/migrator');

  it('register()', function(){
    var d = new Migrator();

    // name, fn
    d.register('test', function(){});
    d.get('test').should.exist;

    // no name
    try {
      d.register();
    } catch (err){
      err.should.be
        .instanceOf(TypeError)
        .property('message', 'name is required');
    }

    // no fn
    try {
      d.register('test');
    } catch (err){
      err.should.be
        .instanceOf(TypeError)
        .property('message', 'fn must be a function');
    }
  });

  it('register() - promisify', function(){
    var d = new Migrator();

    d.register('test', function(args, callback){
      args.should.eql({foo: 'bar'});
      callback(null, 'foo');
    });

    d.get('test')({
      foo: 'bar'
    }).then(function(result){
      result.should.eql('foo');
    });
  });

  it('list()', function(){
    var d = new Migrator();

    d.register('test', function(){});
    d.list().should.have.keys(['test']);
  });

  it('get()', function(){
    var d = new Migrator();

    d.register('test', function(){});
    d.get('test').should.exist;
  });
});