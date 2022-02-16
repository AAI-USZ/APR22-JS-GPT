var rTag = /<a\s*([^>]+)\s*>([^<]*)<\/a>/g,
rHref = /href="(.*)"/,
rProtocol = /^([a-z]+:)?\/{2}/,
rTarget = /target="_blank"/;


data.content = data.content.replace(rTag, function(match, attr, title){
var href = attr.match(rHref);

if (href && rProtocol.test(href[1]) && !rTarget.test(attr)){
attr += ' target="_blank';
}

return '<a ' + attr + '>' + title + '</a>';
});

