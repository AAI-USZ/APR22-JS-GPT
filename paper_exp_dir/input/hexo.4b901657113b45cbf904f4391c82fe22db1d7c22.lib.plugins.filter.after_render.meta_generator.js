'use strict';

function hexoMetaGeneratorInject(data) {
const { config } = this;

const hexoGeneratorTag = `<meta name="generator" content="Hexo ${this.version}">`;

return data.replace(/<head>(?!<\/head>).+?<\/head>/s, (str) => str.replace('</head>', `${hexoGeneratorTag}</head>`));
}

module.exports = hexoMetaGeneratorInject;
