

"use strict";





const fs = require("fs"),
spawn = require("cross-spawn"),
path = require("path"),
log = require("./logging");






function findPackageJson(startDir) {
let dir = path.resolve(startDir || process.cwd());

do {
const pkgFile = path.join(dir, "package.json");

if (!fs.existsSync(pkgFile) || !fs.statSync(pkgFile).isFile()) {
dir = path.join(dir, "..");
continue;
}
return pkgFile;
} while (dir !== path.resolve(dir, ".."));
return null;
}






function installSyncSaveDev(packages) {
const packageList = Array.isArray(packages) ? packages : [packages];
const npmProcess = spawn.sync("npm", ["i", "--save-dev"].concat(packageList),
{ stdio: "inherit" });
const error = npmProcess.error;

if (error && error.code === "ENOENT") {
const pluralS = packageList.length > 1 ? "s" : "";

log.error(`Could not execute npm. Please install the following package${pluralS} with a package manager of your choice: ${packageList.join(", ")}`);
}
}


function fetchPeerDependencies(packageName) {
const npmProcess = spawn.sync(
"npm",
["show", "--json", packageName, "peerDependencies"],
{ encoding: "utf8" }
);

const error = npmProcess.error;

if (error && error.code === "ENOENT") {
return null;
}
const fetchedText = npmProcess.stdout.trim();

return JSON.parse(fetchedText || "{}");


}


function check(packages, opt) {
let deps = [];
const pkgJson = (opt) ? findPackageJson(opt.startDir) : findPackageJson();
let fileJson;

if (!pkgJson) {
throw new Error("Could not find a package.json file. Run 'npm init' to create one.");
}

try {
fileJson = JSON.parse(fs.readFileSync(pkgJson, "utf8"));
} catch (e) {
const error = new Error(e);

error.messageTemplate = "failed-to-read-json";
error.messageData = {
path: pkgJson,
message: e.message
};
throw error;
}

if (opt.devDependencies && typeof fileJson.devDependencies === "object") {
deps = deps.concat(Object.keys(fileJson.devDependencies));
}
if (opt.dependencies && typeof fileJson.dependencies === "object") {
deps = deps.concat(Object.keys(fileJson.dependencies));
}
return packages.reduce((status, pkg) => {
status[pkg] = deps.indexOf(pkg) !== -1;
return status;
}, {});
}


function checkDeps(packages, rootDir) {
return check(packages, { dependencies: true, startDir: rootDir });
}


function checkDevDeps(packages) {
return check(packages, { devDependencies: true });
}


function checkPackageJson(startDir) {
return !!findPackageJson(startDir);
}





module.exports = {
installSyncSaveDev,
fetchPeerDependencies,
checkDeps,
checkDevDeps,
checkPackageJson
};
