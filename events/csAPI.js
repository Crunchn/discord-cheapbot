const { fgURL } = require('../config.json');
const fs = require('node:fs');
const http = require('node:http')
const https = require('node:https')
var uCondition;

module.exports = {
    downloadFile,
    downloadImage,
    doTHINGS,
    uCondition
}

//download function
async function downloadFile(url, outputPath) {
    try {
        const res = await fetch(url);
        const buffer = await res.json();
        fs.writeFileSync(outputPath, JSON.stringify(buffer));
        console.log(`File downloaded and saved as ${outputPath}`);
    } catch (error) {
        console.error(`Error downloading file: ${error.message}`);
    }
};

async function downloadImage(url, onFile) {
    var Stream = require('stream').Transform;
    // Download Image Helper Function
    var downloadImageFromURL = (url, filename, callback) => {
        var client = http;
        if (url.toString().indexOf("https") === 0) {
            client = https;
        }
        client.request(url, function(response) {
            var data = new Stream();
            response.on('data', function(chunk) {
                data.push(chunk);
            });
            response.on('end', function() {
                fs.writeFileSync(filename, data.read());
            });
        }).end();
    };
    // Calling Function to Download
    downloadImageFromURL(url, onFile);
}

async function doTHINGS() {
    var reponse = await fetch(fgURL, {cache: "no-cache" });
    var data = await reponse.json();
    const hddfree = require('../commands/utility/stor/freegames.json');

    if (JSON.stringify(data) === JSON.stringify(hddfree)) {
        //Files match - no update needed
        uCondition = true;
    } else {
        console.log('false - updating.');
        downloadFile(fgURL, './commands/utility/stor/freegames.json');
        downloadFile('https://www.cheapshark.com/api/1.0/stores', './commands/utility/stor/stores.json');
        uCondition = false;
    }
    delete require.cache[require.resolve('../commands/utility/stor/stores.json')];
    delete require.cache[require.resolve('../commands/utility/stor/freegames.json')];

return Promise.resolve(uCondition);
};

/* DEBUG
doTHINGS()
.then(() => {
    console.log(uCondition);
})
*/
