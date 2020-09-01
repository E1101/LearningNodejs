console.log('utils_module is running!');

// Each file has their own scope; it means that every variable and constant or functions defined
// in the file is just accessible in this file.
// Otherwise we use export syntax, the export will provide what you define as a return value to
// require().

const name = 'Mike';
module.exports = name;
