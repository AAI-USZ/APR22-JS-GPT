json = JSON.parse(contents.toString());
err.code = 'EMALFORMED';
parse(json, callback);
