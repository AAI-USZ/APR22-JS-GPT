var Q = require('q');
var fs = require('fs');
var path = require('path');
var mout = require('mout');
var GitFsResolver = require('./resolvers/GitFsResolver');
var GitRemoteResolver = require('./resolvers/GitRemoteResolver');
var FsResolver = require('./resolvers/FsResolver');
var UrlResolver = require('./resolvers/UrlResolver');
var config = require('../config');
var createError = require('../util/createError');

function createResolver(endpoint, options) {
    var split = endpoint.split('#'),
        source,
        target;

    // TODO: extract name from the endpoint and set it up in the options.name
    //       not sure about the @ being used to specify it because it may conflict
    //       with git@ ..

    // Extract the source and target from the endpoint
    source = split[0];
    target = split[1];

    // Configure options
    options = options || {};
    options.target = options.target || target;
    options.config = options.config || config;

    // Git case: git git+ssh, git+http, git+https
    if (/^git(\+(ssh|https?))?:\/\//i.test(source)) {
        source = source.replace(/^git\+/, '');
        return Q.resolve(new GitRemoteResolver(source, options));
    }

    // Git case: .git at the end (probably ssh shortand)
    if (/\.git$/i.test(source)) {
        return Q.resolve(new GitRemoteResolver(source, options));
    }

    // URL case
    if (/^https?:\/\//i.exec(source)) {
        return Q.resolve(new UrlResolver(source, options));
    }

    // Check if source is a git repository
    return Q.nfcall(fs.stat, path.join(source, '.git'))
    .then(function (stats) {
        if (stats.isDirectory()) {
            return new GitFsResolver(source, options);
        }

        throw new Error('Not a Git repository');
    })
    // If not, check if source is a valid file/folder
    .fail(function () {
        return Q.nfcall(fs.stat, source)
        .then(function () {
            return new FsResolver(source, options);
        });
    })
    // If not, check if is a shorthand and expand it
    .fail(function (err) {
        var parts = source.split('/');

        if (parts.length === 2) {
            source = mout.string.interpolate(options.config.shorthandResolver, {
                shorthand: source,
                owner: parts[0],
                package: parts[1]
            });

            return new GitRemoteResolver(source, options);
        }

        throw err;
    })
    // If not, check against the registry
    // TODO:
    // Finally throw a meaningful error
    .fail(function () {
        throw new createError('Could not find appropriate resolver for source "' + source + '"', 'ENORESOLVER');
    });
}

module.exports = createResolver;