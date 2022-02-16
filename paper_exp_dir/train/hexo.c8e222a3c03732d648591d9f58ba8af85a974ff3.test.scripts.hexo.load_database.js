var should = require('chai').should();
var pathFn = require('path');
var fs = require('hexo-fs');

describe('Load database', function(){
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(pathFn.join(__dirname, 'db_test'), {silent: true});
var loadDatabase = require('../../../lib/hexo/load_database');
var dbPath = hexo.database.options.path;

var fixture = {
meta: {
version: 1,
warehouse: require('warehouse').version
},
models: {
Test: [
{_id: "A"},
{_id: "B"},
{_id: "C"}
]
}
};

before(function(){
return fs.mkdir(hexo.base_dir);
});

beforeEach(function(){
hexo._dbLoaded = false;
});

after(function(){
return fs.rmdir(hexo.base_dir);
});

it('database does not exist', function(){
return loadDatabase(hexo);
});

it('database load success', function(){
return fs.writeFile(dbPath, JSON.stringify(fixture)).then(function(){