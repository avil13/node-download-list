var path = require('path');
var fs = require('fs');


module.exports = (pathToCreate) => {
    return path
        .normalize(pathToCreate)
        .split(path.sep)
        .reduce((currentPath, folder) => {
            currentPath += folder + path.sep;

            if (!fs.existsSync(currentPath)) {
                fs.mkdirSync(currentPath);
            }
            return currentPath;
        }, '');
};
