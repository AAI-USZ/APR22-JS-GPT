hexo._dbLoaded = true;

return saveDatabase().then(() => fs.exists(dbPath)).then(exist => {
