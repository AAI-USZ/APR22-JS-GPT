if (filename) this.contentType(filename);
this.header('Content-Disposition', filename
? 'attachment; filename="' + path.basename(filename) + '"'
