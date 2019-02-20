import util       from 'util';
import express    from 'express';
import * as notes from '../models/notes';

import DBG from 'debug';

const debug = DBG('notes:debug-index');
const error = DBG('notes:error-index');


export const router = express.Router;

/* GET home page. */
router.get('/', async (req, res, next) =>
{
  try
  {
    let notelist = await getKeyTitlesList();
    debug(util.inspect(notelist));

    res.render('index', {
      title: 'Notes', 
      notelist: notelist,
      user: req.user ? req.user : undefined
    });
  }
  catch (e)
  {
    error(`INDEX FAIL ${e}`);

    next(e);
  }
});

export function socketio(io)
{
  let emitNoteTitles = async () =>
  {
      const notelist = await getKeyTitlesList();
      debug(`socketio emitNoteTitles ${util.inspect(notelist)}`);

      /*
       * We receive the io object, then use it to emit a
       * notestitles event to all connected browsers.
       *
       *
       * The io.of('/namespace') method restricts whatever
       * follows to the given namespace. In this case,
       * we're emitting a notestitle message to the /home
       * namespace.
       *
       * An event emitted into a namespace is delivered to any
       * socket listening to that namespace.
       */
      io.of('/home').emit('notetitles', { notelist });
  };


  notes.events.on('notecreated', emitNoteTitles); 
  notes.events.on('noteupdate',  emitNoteTitles); 
  notes.events.on('notedestroy', emitNoteTitles); 
}


// ..

/**
 * It generates an array of items containing the key and title for all existing Notes
 *
 * @returns {Promise<*>}
 */
async function getKeyTitlesList()
{
    const keylist = await notes.keylist();

    let keyPromises = keylist.map(key => {
        return notes.read(key).then(note => {
            return { key: note.key, title: note.title };
        });
    });

    return Promise.all(keyPromises);
}