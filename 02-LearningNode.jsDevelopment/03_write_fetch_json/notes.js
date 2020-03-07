const fs = require('fs');

var addNote = (title, body) =>
{
  var notes = _fetchNotes();

  var duplicateNotes = notes.filter((note) => note.title === title);
  if (duplicateNotes.length === 0) {
    var note = {title, body};
    notes.push(note);
    _saveNotes(notes);

    return note;
  }
};

var getAll = () => {
  console.log('Getting all notes');
};

var getNote = (title) => {
  console.log('Getting note', title);
};

var removeNote = (title) => {
  console.log('Removing note', title);
};

// ..

/**
 * @private
 * @returns {Array}
 */
var _fetchNotes = () => {
  try {
    var notesString = fs.readFileSync('./notes-data.json');
    return JSON.parse(notesString);

  } catch(e) {
    // when file is empty or not found exception will throw
    return[];
  }
};

var _saveNotes = (notes) => {
  fs.writeFileSync('./notes-data.json', JSON.stringify(notes));
};

module.exports = {
  addNote,
  getAll,
  getNote,
  removeNote
};
