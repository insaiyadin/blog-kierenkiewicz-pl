const fs = require('fs');

const delFile = (filePath) => {
    fs.unlink(filePath, (err) => {
        if (err) {
            throw err;
        }
    })
};

exports.deleteFile = delFile;