const { spawn } = require('child_process');

const recId = process.argv[2];
if (typeof(process.argv[2]) === "undefined") {
    throw new Error("record ID not specified");
}
var fs = require('fs'),
chunks = fs.readdirSync(__dirname + '/../recordings/' + recId + "/"),
inputStream,
currentfile,
outputStream = fs.createWriteStream(__dirname + `/../recordings/${recId}/merged.pcm`);
chunks.sort((a, b) => { return a - b; }); 
function appendFiles() {
    if (!chunks.length) {
        outputStream.end(() => {console.log('Finished.');
        doFfmpegTask();
    });
        return;
    }
    currentfile = `${__dirname}/../recordings/${recId}/` + chunks.shift();
    inputStream = fs.createReadStream(currentfile);
    inputStream.pipe(outputStream, { end: false });
    inputStream.on('end', function() {
        console.log(currentfile + ' appended');
        appendFiles();
    });
}
appendFiles();
function doFfmpegTask() {
// Step 2: Ffmpeg.
console.log("FFmpeg Rendering");

let ffmpegArgs = [
    '-f', 's16le',
    '-ar', '48000',
    '-ac', '2',
    '-i', `${__dirname}/../recordings/${recId}/merged.pcm`,
    `${__dirname}/../recordings/${recId}/rendered.mp3`
]
 
const ffmpegChild = spawn('ffmpeg', ffmpegArgs);
ffmpegChild.on('exit', function (code, signal) {
    // Uncomment this if you do not want to keep original recording.
    //fs.unlinkSync(__dirname + `/../recordings/${recId}/merged.pcm`);
    console.log('FFMPEG process exited with ' +
                `code ${code} and signal ${signal}`);
 
});
}