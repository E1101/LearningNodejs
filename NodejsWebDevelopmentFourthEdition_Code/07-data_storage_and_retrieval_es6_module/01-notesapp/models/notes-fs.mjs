import fs   from 'fs-extra';
import path from 'path';
import util from 'util';
import Note from './Note';
import DBG  from 'debug';

const debug = DBG('notes:notes-fs');
const error = DBG('notes:error-fs');


export function create(key, title, body)
{
    return crupdate(key, title, body);
}

export function update(key, title, body)
{
    return crupdate(key, title, body);
}

export async function read(key)
{
    let notesdir = await notesDir();
    let thenote  = await readJSON(notesdir, key);

    debug(`READ ${notesdir}/${key} ${util.inspect(thenote)}`);

    return thenote;
}

export async function destroy(key)
{
    let notesdir = await notesDir();
    await fs.unlink( filePath(notesdir, key) );
}

export async function keylist()
{
    let notesdir = await notesDir();
    let filez    = await fs.readdir(notesdir);

    if (!filez || typeof filez === 'undefined')
        filez = [];

    debug(`keylist dir ${notesdir} files=${util.inspect(filez)}`);

    let thenotes = filez.map(async fname =>
    {
        let key = path.basename(fname, '.json');

        debug(`About to READ ${key}`);

        let thenote = await readJSON(notesdir, key);
        return thenote.key; 
    });

    return Promise.all(thenotes); 
}

export async function count()
{
    let notesdir = await notesDir();
    let filez    = await fs.readdir(notesdir);

    return filez.length;
}

export async function close() {}


async function crupdate(key, title, body)
{
    let notesdir = await notesDir();

    if (key.indexOf('/') >= 0)
        throw new Error(`key ${key} cannot contain '/'`);

    let note        = new Note(key, title, body);
    const writeTo   = filePath(notesdir, key);
    const writeJSON = note.JSON;

    debug(`WRITE ${writeTo} ${writeJSON}`);

    await fs.writeFile(writeTo, writeJSON, 'utf8');
    return note;
}


// ..

async function notesDir()
{
    const dir = process.env.NOTES_FS_DIR || "notes-fs-data";
    await fs.ensureDir(dir);

    return dir;
}

async function readJSON(notesdir, key)
{
    const readFrom = filePath(notesdir, key);
    let data       = await fs.readFile(readFrom, 'utf8');

    debug(`readJSON ${data}`);

    return Note.fromJSON(data);
}

function filePath(notesdir, key)
{
    return path.join(notesdir, `${key}.json`);
}
