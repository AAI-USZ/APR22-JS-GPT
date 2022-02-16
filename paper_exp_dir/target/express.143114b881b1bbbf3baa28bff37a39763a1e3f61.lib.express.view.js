var render = exports.render = function(view, options) {
layout = options.layout === undefined ? true : options.layout
content = engine.parse(content, options)
