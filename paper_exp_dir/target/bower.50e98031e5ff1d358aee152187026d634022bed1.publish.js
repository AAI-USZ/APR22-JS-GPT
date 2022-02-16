var dir = path.join(tmp.dirSync().name, 'package');
delete jsonPackage.dependencies;
delete jsonPackage.resolutions;
