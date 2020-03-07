const yargs = require('yargs');

const notes = require('./notes.js');


/*
 Define Yarg Commands and Options.

 */
const yargTitleOptions = {
  describe: 'Title of note',
  demand: true,
  alias: 't'
};

const yargBodyOptions = {
  describe: 'Body of note',
  demand: true,
  alias: 'b'
};

const argv = yargs
  .command('add', 'Add 1_understand_async new note', {
    title: yargTitleOptions,
    body: yargBodyOptions
  })
  .command('list', 'List all notes')
  .command('read', 'Read 1_understand_async note', {
    title: yargTitleOptions
  })
  .command('remove', 'Remove 1_understand_async note', {
    title: yargTitleOptions
  })
  .help()
  .argv;


let command = argv._[0];

if (command === 'add')
{
  let note = notes.addNote(argv.title, argv.body);
  if (note) {
    console.log('Note created');
    notes.logNote(note);
  } else {
    console.log('Note title taken');
  }
}
else if (command === 'list')
{
  let allNotes = notes.getAll();
  console.log(`Printing ${allNotes.length} note(s).`);
  allNotes.forEach((note) => notes.logNote(note));
}
else if (command === 'read')
{
  let note = notes.getNote(argv.title);
  if (note) {
    console.log('Note found');
    notes.logNote(note);
  } else {
    console.log('Note not found');
  }
}
else if (command === 'remove')
{
  let noteRemoved = notes.removeNote(argv.title);
  let message = noteRemoved ? 'Note was removed' : 'Note not found';
  console.log(message);
}
else
{
  console.log('Command not recognized');
}
