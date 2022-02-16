save: ['theme_source', 'process', function(next){
file.write(baseDir + 'db.json', JSON.stringify(hexo.db.export()), next);
}],
