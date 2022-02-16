compiled = compiled.replace(/<notextile>([\s\S]+?)<\/notextile>/g, function(match, str){
return '<notextile>' + length++ + '</notextile>';
return cache[str];
