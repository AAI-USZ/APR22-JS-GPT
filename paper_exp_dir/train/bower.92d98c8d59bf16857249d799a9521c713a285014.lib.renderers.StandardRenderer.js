require('colors');
var path = require('path');
var mout = require('mout');
var archy = require('archy');
var stringifyObject = require('stringify-object');
var template = require('../util/template');

function StandardRenderer(command, config) {
this._sizes = {
id: 13,
label: 20,
sumup: 5
};
this._colors = {
warn: 'yellow',
error: 'red',
conflict: 'magenta',
'default': 'cyan'
};

this._command = command;
this._config = config;

if (this.constructor._wideCommands.indexOf(command) === -1) {
this._compact = true;
} else {
this._compact = process.stdout.columns < 120;
}
}

StandardRenderer.prototype.end = function (data) {
var method = '_' + mout.string.camelCase(this._command);

if (this[method]) {
this[method](data);
}
};

StandardRenderer.prototype.error = function (err) {
var str;

this._guessOrigin(err);

err.id = err.code || 'error';
err.level = 'error';

str = this._prefix(err) + ' ' + err.message.replace(/\r?\n/g, ' ').trim() + '\n';
this._write(process.stderr, 'bower ' + str);


if (err.details) {
str = '\nAdditional error details:\n'.yellow + err.details.trim() + '\n';
this._write(process.stderr, str);
}



if (this._config.verbose || !err.code || err.errno) {


str = '\nStack trace:\n'.yellow;
str += err.stack + '\n';
this._write(process.stderr, str);
}
};

StandardRenderer.prototype.log = function (log) {
var method = '_' + mout.string.camelCase(log.id) + 'Log';

this._guessOrigin(log);


if (this[method]) {
this[method](log);
} else {
this._genericLog(log);
}
};

StandardRenderer.prototype.updateNotice = function (data) {
var str = template.render('std/update-notice.std', data);
this._write(process.stderr, str);
};



StandardRenderer.prototype._help = function (data) {
var str;
var that = this;
var specific;

if (!data.command) {
str = template.render('std/help.std', data);
that._write(process.stdout, str);
} else {

specific = 'std/help-' + data.command.replace(/\s+/g, '/') + '.std';

if (template.exists(specific)) {
str = template.render(specific, data);
} else {
str =  template.render('std/help-generic.std', data);
}

that._write(process.stdout, str);
}
};

StandardRenderer.prototype._install = function (packages) {
var str = '';

mout.object.forOwn(packages, function (pkg) {
var cliTree;


mout.object.forOwn(pkg.dependencies, function (dependency) {
dependency.dependencies = {};
});

pkg.canonicalDir = path.relative(this._config.cwd, pkg.canonicalDir);

pkg.root = true;

cliTree = this._tree2archy(pkg);
str += '\n' + archy(cliTree);
}, this);

if (str) {
this._write(process.stdout, str);
}
};

StandardRenderer.prototype._update = function (packages) {
this._install(packages);
};

StandardRenderer.prototype._list = function (tree) {
var cliTree;

tree.root = true;
cliTree = this._tree2archy(tree);

this._write(process.stdout, archy(cliTree));
};

StandardRenderer.prototype._search = function (results) {
var str = template.render('std/search-results.std', results);
this._write(process.stdout, str);
};

StandardRenderer.prototype._info = function (data) {
var str;



if (typeof data === 'object' && data.name && data.versions) {
str = template.render('std/info.std', data);
} else {

str = '\n' + stringifyObject(data, { indent: '  ' }) + '\n';
}

this._write(process.stdout, str);
};

StandardRenderer.prototype._lookup = function (data) {
var str = template.render('std/lookup.std', data);

this._write(process.stdout, str);
};

StandardRenderer.prototype._link = function (data) {
this._sizes.id = 4;

this.log({
id: 'link',
level: 'info',
message: data.src + ' > ' + data.dst
});
};

StandardRenderer.prototype._cacheList = function (entries) {
entries.forEach(function (entry) {
var pkgMeta = entry.pkgMeta;
var version = pkgMeta.version || pkgMeta._target;
this._write(process.stdout, pkgMeta.name + '=' + pkgMeta._source + '#' + version + '\n');
}, this);
};

StandardRenderer.prototype._cacheClean = function (entries) {

entries.forEach(function (entry) {
this._write(process.stdout, entry.pkgMeta.name + ' ' + entry.canonicalDir + '\n');
}, this);
};



StandardRenderer.prototype._genericLog = function (log) {
var stream;
var str;

if (log.level === 'warn') {
stream = process.stderr;
} else {
stream = process.stdout;
}

str = this._prefix(log) + ' ' + log.message + '\n';
this._write(stream, 'bower ' + str);
};

StandardRenderer.prototype._checkoutLog = function (log) {
if (this._compact) {
log.message = log.origin.split('#')[0] + '#' + log.message;
}

this._genericLog(log);
};

StandardRenderer.prototype._incompatibleLog = function (log) {
var str;
var templatePath;


log.data.picks.forEach(function (pick) {
pick.dependants = pick.dependants.map(function (dependant) {
var release = dependant.pkgMeta._release;
return dependant.endpoint.name + (release ? '#' + release : '');
}).join(', ');
});

templatePath = log.data.resolution ? 'std/conflict-resolved.std' : 'std/conflict.std';
str = template.render(templatePath, log.data);

this._write(process.stdout, '\n');
this._write(process.stdout, str);
this._write(process.stdout, '\n');
};

StandardRenderer.prototype._solvedLog = function (log) {
this._incompatibleLog(log);
};

StandardRenderer.prototype._cachedEntryLog = function (log) {
if (this._compact) {
log.message = log.origin;
}

this._genericLog(log);
};



StandardRenderer.prototype._guessOrigin = function (log) {
var data = log.data;

if (!data) {
return;
}

if (data.endpoint) {
log.origin = data.endpoint.name || (data.registry && data.endpoint.source);


if (!log.origin && data.resolver) {
log.origin = data.resolver.name;
}

if (log.origin && data.endpoint.target) {
log.origin += '#' + data.endpoint.target;
}
} else if (data.name) {
log.origin = data.name;

if (data.version) {
log.origin += '#' + data.version;
}
}
};

StandardRenderer.prototype._prefix = function (log) {
var label;
var length;
var nrSpaces;
var id = this.constructor._idMappings[log.id] || log.id;
var idColor = this._colors[log.level] || this._colors['default'];

if (this._compact) {


if (id.length > this._sizes.id) {
this._sizes.id = id.length += this._sizes.sumup;
}

return mout.string.rpad(id, this._sizes.id)[idColor];
}


label = log.origin || '';
length = id.length + label.length + 1;
nrSpaces = this._sizes.id + this._sizes.label - length;


if (nrSpaces < 1) {

this._sizes.label = label.length + this._sizes.sumup;
nrSpaces = this._sizes.id + this._sizes.label - length;
}

return label.green + mout.string.repeat(' ', nrSpaces) + id[idColor];
};

StandardRenderer.prototype._write = function (stream, str) {
if (!this._config.color) {
str = str.replace(/\x1B\[\d+m/g, '');
}

stream.write(str);
};

StandardRenderer.prototype._tree2archy = function (node) {
var dependencies = mout.object.values(node.dependencies);
var version = !node.missing ? node.pkgMeta._release || node.pkgMeta.version : null;
var label = node.endpoint.name + (version ? '#' + version : '');
var update;

if (node.root) {
label += ' ' + node.canonicalDir;
}


if (node.missing) {
label += ' missing'.red;
return label;
}

if (node.linked) {
label += ' linked'.magenta;
}

if (node.incompatible) {
label += ' incompatible'.yellow + ' with ' + node.endpoint.target;
} else if (node.extraneous) {
label += ' extraneous'.green;
}




if (node.update) {
update = '';

if (node.update.target && node.pkgMeta.version !== node.update.target) {
update += node.update.target + ' available';
}

if (node.update.latest !== node.update.target) {
