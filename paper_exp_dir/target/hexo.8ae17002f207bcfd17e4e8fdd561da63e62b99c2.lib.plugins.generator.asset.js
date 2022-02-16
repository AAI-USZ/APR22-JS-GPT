return Promise.filter(self.model(name).toArray(), asset => fs.exists(asset.source).tap(exist => {
if (!exist) return asset.remove();
})).map(asset => {
