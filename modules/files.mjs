import fs from 'fs';

/**
 * Loads a text file from a URL and returns its contents
 * @param {String} url of file to read
 * @returns {Promise} String data contents of file
 */
async function loadTextFile(url) {
    return new Promise((resolve, reject) => {
        fs.readFile(url, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                reject(err);
            }
            else {
                resolve(data);
            }
        });
    });
}

export {
    loadTextFile
}