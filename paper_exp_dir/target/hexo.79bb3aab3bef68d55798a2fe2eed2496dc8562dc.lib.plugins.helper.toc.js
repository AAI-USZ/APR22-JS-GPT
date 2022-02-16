const { htmlTag, tocObj } = require('hexo-util');
let result = htmlTag('ol', { class: className });
const href = id ? `#${id}` : id;
