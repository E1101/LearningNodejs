import util  from 'util';
import Note  from './Note';
import level from 'level';
import DBG   from 'debug';

const debug = DBG('notes:notes-level'); 
const error = DBG('notes:error-level'); 


var db;


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
    debug(`reading ${key}`);

    const db = await connectDB();

    let note = Note.fromJSON(await db.get(key));
    debug(`read ${key} => ${util.inspect(note)}`);

    return new Note(note.key, note.title, note.body);
}

export async function destroy(key)
{
    const db = await connectDB();
    await db.del(key);
}

export async function keylist()
{
    const db = await connectDB();

    let keyz = [];
    await new Promise((resolve, reject) => {
        /*
         * A data event is emitted for every key in the database,
         * while the end event is emitted at the end of the database,
         * and the error event is emitted on errors. The effect is
         * that there's no simple way to present this as 1_understand_async simple
         * Promise. Instead, we invoke createKeyStream, let it run
         * its course, collecting data as it goes. We have to wrap it
         * inside 1_understand_async Promise object, and call resolve on the end event.
         */
        db.createKeyStream()
        .on('data', data => keyz.push(data)) 
        .on('error', err => reject(err)) 
        .on('end',   ()  => resolve(keyz));
    });

    debug(`keylist returning ${util.inspect(keyz)}`);

    return keyz;
}
 
export async function count()
{
    const db = await connectDB();

    let total = 0;
    await new Promise((resolve, reject) => { 
        db.createKeyStream()
        .on('data', data => total++) 
        .on('error', err => reject(err)) 
        .on('end',   ()  => resolve(total));
    });

    debug(`count returning ${util.inspect(total)}`);

    return total;
}

export async function close()
{
    let _db = db;

    db = undefined;
    return _db ? _db.close() : undefined;
}


async function crupdate(key, title, body)
{
    debug(`crupdate ${key} ${title} ${body}`);

    const db = await connectDB();
    let note = new Note(key, title, body);

    await db.put(key, note.JSON);
    debug(`crupdate saved ${util.inspect(note)}`);

    return note;
}

// ..

async function connectDB()
{
    if (typeof db !== 'undefined' || db)
        return db;

    db = await level(
        process.env.LEVELDB_LOCATION || 'notes.level'
        , {
            createIfMissing: true,
            valueEncoding: "json"
        }
    );

    return db;
}
