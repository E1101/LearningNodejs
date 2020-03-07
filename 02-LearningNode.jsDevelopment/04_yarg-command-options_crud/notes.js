const fs = require('fs');

let addNote = (title, body) => {
  let notes = _fetchNotes();

  let duplicateNotes = notes.filter((note) => note.title === title);
  if (duplicateNotes.length === 0) {
    let note = {title, body};
    notes.push(note);
    _saveNotes(notes);

    return note;
  }
};

let getNote = (title) => {
  let notes = _fetchNotes();
  let filteredNotes = notes.filter((note) => note.title === title);

  return filteredNotes[0];
};

let removeNote = (title) => {
  let notes = _fetchNotes();
  let filteredNotes = notes.filter((note) => note.title !== title);
  _saveNotes(filteredNotes);

  return notes.length !== filteredNotes.length;
};

let getAll = () => {
  return _fetchNotes();
};

let logNote = (note) => {
  // Inserting the statement debugger; will enable a breakpoint at that position in the code
  debugger;
  console.log('--');
  console.log(`Title: ${note.title}`);
  console.log(`Body: ${note.body}`);
};

// ..

/**
 * @private
 * @returns {Array}
 */
let _fetchNotes = () => {
  try {
    let notesString = fs.readFileSync('./notes-data.json');
    return JSON.parse(notesString);

  } catch(e) {
    // when file is empty or not found exception will throw
    return[];
  }
};

let _saveNotes = (notes) => {
  fs.writeFileSync('./notes-data.json', JSON.stringify(notes));
};

module.exports = {
  addNote,
  getAll,
  getNote,
  removeNote,
  logNote
};
