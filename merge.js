var fs = require('fs'),
    chunks = fs.readdirSync('./recordings'),
    inputStream,
    currentfile,
    outputStream = fs.createWriteStream('./recordings/merge.pcm');

chunks.sort((a, b) => { return a - b; });

function appendFiles() {
    if (!chunks.length) {
        outputStream.end(() => console.log('Finished.'));
        return;
    }

    currentfile = './recordings/' + chunks.shift();
    inputStream = fs.createReadStream(currentfile);
    
    inputStream.pipe(outputStream, { end: false });

    inputStream.on('end', function() {
        console.log(currentfile + ' appended');
        appendFiles();        
    });
}

appendFiles();