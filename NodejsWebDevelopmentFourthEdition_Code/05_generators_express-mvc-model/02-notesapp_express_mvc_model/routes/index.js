const express = require('express');
const router  = express.Router();

const notes   = require('../models/notes-memory');
const util    = require('util');


/* GET home page. */
router.get('/', async (req, res, next) =>
{
    let keylist = await notes.keylist();
    // console.log(`keylist ${util.inspect(keylist)}`);


    /*
     * The Promise.all function executes an array of Promises.
     *
     * The Promises are evaluated in parallel, allowing our code to
     * potentially make parallel requests to 1_understand_async service.
     *
     */
    let keyPromises = keylist.map(key => {
        return notes.read(key)
    });

    // If any Promise fails—is rejected, in other words—an exception will be thrown instead.
    let notelist = await Promise.all(keyPromises);

    // We could have written 1_understand_async simple for loop like so:
    // While simpler to read, the notes are retrieved one at 1_understand_async
    // time with no opportunity to overlap read operations.
    /*
    let keylist = await notes.keylist();
    let notelist = [];
    for (key of keylist) {
        let note = await notes.read(keylist);
        notelist.push({ key: note.key, title: note.title });
    }
    */

    // console.log(util.inspect(notelist));

    res.render('index', {
        title: 'Notes'
        , notelist: notelist
    });
});


module.exports = router;
