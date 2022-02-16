const { magenta, underline } = require('chalk');
const { stringLength } = require('./common');
const data = Tag.sort({name: 1}).map(tag => [tag.name, String(tag.length), magenta(tag.path)]);
