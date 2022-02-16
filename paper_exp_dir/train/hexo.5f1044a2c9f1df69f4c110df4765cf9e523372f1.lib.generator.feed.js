var util = require('../util'),
file = util.file,
extend = require('../extend'),
xml = require('jstoxml'),
_ = require('underscore');

extend.generator.register(function(locals, render, callback){
var publicDir = hexo.public_dir,
config = hexo.config;

var content = [
{title: '<![CDATA[' + config.title + ']]>'},
{
_name: 'link',
_attrs: {
href: config.url + '/atom.xml',
rel: 'self'
}
