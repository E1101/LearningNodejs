'use strict';

/*
 * Mocha (http://mochajs.org/) is one of many test frameworks available for Node.js.
 * As you'll see shortly, it helps us write test cases and test suites, and it provides
 * a test results reporting mechanism. It was chosen over the alternatives because it
 * supports Promises. It fits very well with the Chai assertion library mentioned
 * earlier.
 *
 */

/*
 * Because we've written the Notes application using ES6 modules, we have a small challenge
 * to overcome. Mocha only supports running tests in CommonJS modules, and Node.js
 * (as of this writing) does not support loading an ES6 module from a CommonJS module. An
 * ES6 module can use import to load a CommonJS module, but a CommonJS module cannot use
 * require to load an ES6 module.
 *
 * A module, esm, exists which allows that combination to work.
 * Once you've done this, your CommonJS module can load an ES6 module as evidenced by
 * require('../models/notes') a couple of lines later.
 *
 */
require = require("@std/esm")(module,{"esm":"js"});

const assert = require('chai').assert;
const model  = require('../models/notes');


describe("Model Test", function()
{
  /*
  * The hook functions let you, the test suite author, set up and tear down required
  * conditions for the test suite to operate as desired.
  */
  beforeEach(async function()
  {
    try
    {
      // console.log('beforeEach');
      const keyz = await model.keylist();
      // console.log(`beforeEach keylist ${keyz}`);
      for (let key of keyz) {
        await model.destroy(key);
      }

      // console.log('beforeEach destroy');
      await model.create("n1", "Note 1", "Note 1");
      await model.create("n2", "Note 2", "Note 2");
      await model.create("n3", "Note 3", "Note 3");
      // console.log('beforeEach all');
    }
    catch (e)
    {
      console.error(e);

      throw e;
    }
  });

  afterEach(function()
  {
      // console.log('afterEach');
  });

  after(function()
  {
      // console.log('after -- closing');
      model.close();
  });


  // ..

  describe("check keylist", function()
  {
    it("should have three entries", async function()
    {
      const keyz = await model.keylist();

      assert.exists(keyz);
      assert.isArray(keyz);
      assert.lengthOf(keyz, 3);
    });

    it("should have keys n1 n2 n3", async function()
    {
      const keyz = await model.keylist();

      assert.exists(keyz);
      assert.isArray(keyz);
      assert.lengthOf(keyz, 3);
      for (let key of keyz) {
        assert.match(key, /n[123]/, "correct key");
      }
    });

    it("should have titles Node #", async function()
    {
      const keyz = await model.keylist();

      assert.exists(keyz);
      assert.isArray(keyz);
      assert.lengthOf(keyz, 3);

      var keyPromises = keyz.map(key => model.read(key));
      const notez     = await Promise.all(keyPromises);
      for (let note of notez) {
        assert.match(note.title, /Note [123]/, "correct title");
      }
    });

  });

  describe("read note", function()
  {
    it("should have proper note", async function()
    {
        const note = await model.read("n1");

        assert.exists(note);
        assert.deepEqual(
            {key: note.key, title: note.title, body: note.body }
            , {
                key: "n1",
                title: "Note 1",
                body: "Note 1"
            }
        );
    });
    
    it("Unknown note should fail", async function()
    {
        try
        {
          const note = await model.read("badkey12");

          assert.notExists(note);
          throw new Error("should not get here");
        }
        catch(err)
        {
          // this is expected, so do not indicate error
          assert.notEqual(err.message, "should not get here");
        }
    });
  });

  describe("change note", function()
  {
    it("after a successful model.update", async function()
    {
        const newnote = await model.update("n1", "Note 1 title changed", "Note 1 body changed");
        const note    = await model.read("n1");

        assert.exists(note);
        assert.deepEqual(
            { key: note.key, title: note.title, body: note.body }
            , {
                key: "n1",
                title: "Note 1 title changed",
                body: "Note 1 body changed"
            }
        );
    });
  });

  describe("destroy note", function()
  {
    it("should remove note", async function()
    {
        await model.destroy("n1");
        const keyz = await model.keylist();

        assert.exists(keyz);
        assert.isArray(keyz);
        assert.lengthOf(keyz, 2);
        for (let key of keyz) {
          assert.match(key, /n[23]/, "correct key");
        }
    });

    it("should fail to remove unknown note", async function()
    {
        try
        {
          await model.destroy("badkey12");

          throw new Error("should not get here");
        }
        catch(err)
        {
            // this is expected, so do not indicate error
            assert.notEqual(err.message, "should not get here");
        }
    });
  });

});