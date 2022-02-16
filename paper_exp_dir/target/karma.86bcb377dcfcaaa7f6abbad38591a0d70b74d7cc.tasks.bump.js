var pkg = grunt.config('pkg');
var previousVersion = pkg.version;
var newVersion = pkg.version = bumpVersion(previousVersion, type);
