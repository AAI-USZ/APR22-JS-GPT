var should = require('chai').should();
var pathFn = require('path');
var fs = require('hexo-fs');
var _ = require('lodash');

describe('Load config', function(){
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(pathFn.join(__dirname, 'config_test'), {silent: true});
var loadConfig = require('../../../lib/hexo/load_config');
var defaultConfig = require('../../../lib/hexo/default_config');

function reset(){
hexo.env.init = false;
hexo.config = _.clone(defaultConfig);
}

before(function(){
return fs.mkdirs(pathFn.join(hexo.base_dir, 'themes', 'landscape')).then(function(){
return hexo.init();
});
});

it('config file does not exist', function(){
return loadConfig(hexo).then(function(){
hexo.env.init.should.be.false;
});
});

it('_config.yml exists', function(){
var configPath = pathFn.join(hexo.base_dir, '_config.yml');

return fs.writeFile(configPath, 'foo: 1').then(function(){
return loadConfig(hexo);
}).then(function(){
hexo.env.init.should.be.true;
hexo.config.foo.should.eql(1);
hexo.theme_dir.should.eql(pathFn.resolve(hexo.base_dir, 'themes', 'landscape') + pathFn.sep);
hexo.theme_script_dir.should.eql(pathFn.resolve(hexo.theme_dir, 'scripts') + pathFn.sep);

reset();
return fs.unlink(configPath);
});
});

it('_config.yaml exists', function(){
var configPath = pathFn.join(hexo.base_dir, '_config.yaml');
