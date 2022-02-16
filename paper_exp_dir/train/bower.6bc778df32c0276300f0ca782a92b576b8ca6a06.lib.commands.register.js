var Q = require('q');
var chalk = require('chalk');
var PackageRepository = require('../core/PackageRepository');
var createError = require('../util/createError');
var defaultConfig = require('../config');

function register(logger, name, source, config) {
var repository;
var registryClient;
var force;
var url;
var githubSourceRegex = /^\w[\w-]*\/\w[\w-]*$/;
var getGithubUrl = function(source) {
return 'git@github.com:' + source + '.git';
};

config = defaultConfig(config);
force = config.force;

name = (name || '').trim();
source = (source || '').trim();

url = source.match(githubSourceRegex) ? getGithubUrl(source) : source;


config.offline = false;
config.force = true;

return Q.try(function() {

if (!name || !url) {
throw createError(
'Usage: bower register <name> <url>',
'EINVFORMAT'
);
}



