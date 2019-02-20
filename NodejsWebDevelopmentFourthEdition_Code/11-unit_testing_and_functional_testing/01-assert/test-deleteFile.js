const fs     = require('fs');
const assert = require('assert');
const df     = require('./deleteFile');


df.deleteFile("no-such-file", (err) =>
{
    assert.throws(
        function()
        {
            if (err) throw err;
        }
        , function(error)
        {
            return (error instanceof Error) && /does not exist/.test(error);
        }
        , "unexpected error"
    );
});
