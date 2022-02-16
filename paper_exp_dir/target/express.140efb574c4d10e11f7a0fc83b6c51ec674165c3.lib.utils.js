.replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g, function(_, slash, format, key, capture, optional){
keys.push({ name: key, optional: !! optional });
slash = slash || '';
