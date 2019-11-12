/*
 Arguments including commands and parameters can pass to script like this:
 $ node app.js remove --title "note title"
 */
const notes = require('./notes.js');

const fs    = require('fs');
const _     = require('lodash');
const yargs = require('yargs');

/*
 By run the script on command line:
  $ node app.js remove --title "note title"

 it will contains this object:
  { _: [ 'remove' ], title: 'note title', '$0': 'app.js' }
 */
const argv = yargs.argv;
let command = argv._[0];

if (command === 'add') {
  let note = notes.addNote(argv.title, argv.body);
  if (note) {
    console.log('Note created');
    console.log('--');
    console.log(`Title: ${note.title}`);
    console.log(`Body: ${note.body}`);
  } else {
    console.log('Note title taken');
  }

} else if (command === 'list') {
  notes.getAll();

} else if (command === 'read') {
  notes.getNote(argv.title);

} else if (command === 'remove') {
  notes.removeNote(argv.title);

} else {
  console.log('Command not recognized');
}
