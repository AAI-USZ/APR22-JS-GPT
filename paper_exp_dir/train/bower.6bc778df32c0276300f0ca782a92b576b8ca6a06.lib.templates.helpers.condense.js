var mout = require('mout');
var leadLinesRegExp = /^\r?\n/;
var multipleLinesRegExp = /\r?\n(\r?\n)+/gm;

function condense(Handlebars) {
Handlebars.registerHelper('condense', function(context) {
var str = context.fn(this);


str = str.replace(multipleLinesRegExp, '$1');


str = str.replace(leadLinesRegExp, '');


str = mout.string.rtrim(str);

return str;
});
}

module.exports = condense;
