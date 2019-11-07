const {promisify} = require('util');

const fs = require('fs');
const readFileAsync = promisify(fs.readFile);

const filePath = process.argv[2];


// The functions need not to be chained one after another, simply await the function that returns the Promise.
// But the function async needs to be declared before awaiting function returning Promise.
async function main() {
    try {
        // asks the javascript engine running the code to wait for the function to
        // complete before moving on to the next line to execute it.
        // await function could only be used on async function
        const text = await readFileAsync(filePath, {encoding: 'utf8'});
        console.log('CONTENT:', text);
    }
    catch (err) {
        console.log('ERROR:', err);
    }
}

main();
