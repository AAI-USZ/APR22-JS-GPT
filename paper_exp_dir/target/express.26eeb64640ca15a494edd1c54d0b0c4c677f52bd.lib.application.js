var err = new Error('Failed to lookup view "' + name + '"');
err.view = view;
return fn(err);
