const fs = require('fs');
const path = require('path');
/* eslint-enable */

const deleteFolderRecursive = (_path) => {
  if (fs.existsSync(_path)) {
    fs.readdirSync(_path).forEach((file) => {
      const curPath = path.join(_path, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(_path);
  }
};

const folder = process.argv.slice(2)[0];

if (folder) {
  deleteFolderRecursive(path.join(__dirname, '../dist', folder));
} else {
  deleteFolderRecursive(path.join(__dirname, '../dist/cjs'));
  deleteFolderRecursive(path.join(__dirname, '../dist/esm'));
  deleteFolderRecursive(path.join(__dirname, '../dist/umd'));
  deleteFolderRecursive(path.join(__dirname, '../dist/types'));
}
