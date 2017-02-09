import * as process from 'child_process';
const spawn = process.spawn;
// const ls = spawn('ls', ['-lh', __dirname]);

// ls.stdout.on('data', (data) => {
//     console.log(`stdout: ${data}`);
// });

// ls.stderr.on('data', (data) => {
//     console.log(`stderr: ${data}`);
// });

// ls.on('close', (code) => {
//     console.log(`child process exited with code ${code}`);
// });

const cat = process.exec('cat ./ls.ts | wc -l', (error, stdout, stderr) => {
    if (error) {
        console.error(`exec error: ${error}`);
        return;
    }
    // console.log(`stdout: ${stdout}`);
    // console.log(`stderr: ${stderr}`);
});

console.log(cat.pid);
