var extend = require('../extend');

return function(content){
return content.replace(/<[^>]*>/g, '');
}
});
