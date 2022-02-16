



var load_original = window.requirejs.load;
requirejs.load = function (context, moduleName, url) {
if (__testacular__.files.hasOwnProperty(url)) {
url = url + '?' + __testacular__.files[url];
} else {
console.error('There is no timestamp for ' + url + '!');
}

return load_original.call(this, context, moduleName, url);
};

