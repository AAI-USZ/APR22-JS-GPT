



var load_original = window.requirejs.load;
requirejs.load = function (context, moduleName, url) {
return load_original.call(this, context, moduleName, url + '?' + __testacular__.files[url]);
};

require.config({
baseUrl: '/base'
});


__testacular__.loaded = function() {};
