setProperty(config, key, castValue(value));
const result = extname === '.json' ? JSON.stringify(config) : yaml.dump(config);
return fs.writeFile(configPath, result);
