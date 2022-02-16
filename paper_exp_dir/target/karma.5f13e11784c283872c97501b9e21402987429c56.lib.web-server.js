function createServeStaticFile (config) {
return common.createServeFile(fs, path.normalize(path.join(__dirname, '/../static')), config)
}
