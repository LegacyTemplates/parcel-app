// Copy .dll outputs of ../server/server.csproj to ../plugins

var fs = require("fs");
var path = require("path");

var serverReleaseDir = path.resolve(__dirname, "../../server/bin/Release/netcoreapp2.1/");
var pluginsDir = path.resolve(__dirname, "../../app/plugins");
var wwwrootDir = path.resolve(__dirname, "../../app/wwwroot");

if (!fs.existsSync(pluginsDir)) {
    fs.mkdirSync(pluginsDir);
}

var files = fs.readdirSync(serverReleaseDir);
files.forEach(file => {
  if (!file.endsWith(".dll")) return;

  var fromfile = path.join(serverReleaseDir, file);
  var toFile = path.join(pluginsDir, file);
  fs.copyFileSync(fromfile, toFile);
});

function rmDir(dirPath, removeSelf) {
  try {
    var files = fs.readdirSync(dirPath);
  } catch (e) {
    return;
  }
  if (files.length > 0) {
    for (var i = 0; i < files.length; i++) {
      var filePath = dirPath + "/" + files[i];
      if (fs.statSync(filePath).isFile()) {
        fs.unlinkSync(filePath);
      } else {
        rmDir(filePath, true);
      }
    }
  }
  if (removeSelf) {
    fs.rmdirSync(dirPath);
  }
}

rmDir(wwwrootDir);
