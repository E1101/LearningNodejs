import util    from 'util';
import Note    from './Note';
import mongodb from 'mongodb'; 
import DBG     from 'debug';


const debug = DBG('notes:notes-mongodb');
const error = DBG('notes:error-mongodb');

const MongoClient = mongodb.MongoClient;


let client;


export async function create(key, title, body)
{
    const { db, client } = await connectDB();

    const note       = new Note(key, title, body);

    const collection = db.collection('notes'); 
    await collection.insertOne({
        notekey: key
        , title: title
        , body: body
    });

    return note;
}
 
export async function update(key, title, body)
{
    const { db, client } = await connectDB();

    const note       = new Note(key, title, body);

    const collection = db.collection('notes'); 
    await collection.updateOne(
        { notekey: key }
        , {$set: { title: title, body: body }}
    );

    return note;
}

export async function read(key)
{
    const { db, client } = await connectDB();

    const collection = db.collection('notes');
    const doc        = await collection.findOne({ notekey: key });

    return new Note(doc.notekey, doc.title, doc.body);
}

export async function destroy(key)
{
    const { db, client } = await connectDB();

    const collection = db.collection('notes');
    await collection.findOneAndDelete({ notekey: key });
}

export async function keylist()
{
    const { db, client } = await connectDB();


    debug(`keylist ${util.inspect(db)}`);
    const collection = db.collection('notes'); 
    const keyz       = await new Promise((resolve, reject) =>
    {
        var keyz = [];

        collection.find({}).forEach( 
            note => { keyz.push(note.notekey); }
            , err  => {
                if (err)
                    reject(err);
                else
                    resolve(keyz);
            }
        ); 
    });

    return keyz;
}

export async function count()
{
    const { db, client } = await connectDB();


    const collection = db.collection('notes');
    const count      = await collection.count({});

    return count;
}

export async function close()
{
    if (client)
        client.close();

    client = undefined;
}


// ..

async function connectDB()
{
    if (! client )
        client = await MongoClient.connect(process.env.MONGO_URL);

    return {
        db: client.db(process.env.MONGO_DBNAME),
        client: client
    };
}
