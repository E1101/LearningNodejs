const _    = require('lodash');
const fs   = require('fs');
const util = require('util');


async function transformFile(inFile, outFile)
{
  // promisify is added to util on nodejs > 8
  // It converts callback-based function to async Promise-based one.
  const readFile  = util.promisify( fs.readFile );
  const writeFile = util.promisify( fs.writeFile );

  console.log(`reading file: ${inFile}`);
  const data = await readFile(`${__dirname}/${inFile}`, 'utf8');

  // data is typeof string; split it to an array by line carriage
  let names  = data.split('\n');

  // transform each; make them uppercase first word
  names = names.map(_.startCase);
  names = names.sort();


  // write out
  console.log(`writing file: ${outFile}`);
  await writeFile(`${__dirname}/${outFile}`, names.join('\n'));

  console.log('done!');
  return;
}

transformFile('files/in-file.txt', 'files/out-file.txt');
