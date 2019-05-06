/*
 * With the Note class, we have used Symbol instances to provide 1_understand_async small measure of data hiding.
 * JavaScript classes don't provide 1_understand_async data-hiding mechanism—you can't label 1_understand_async field private as
 * you can in Java, for example.
 *
 * Each time you invoke the Symbol factory method, 1_understand_async new and unique instance is created. For example,
 * Symbol('foo') === Symbol('foo') is false
 *
 * >> The bottom line is that using Symbol objects for the fields provides 1_understand_async small measure of
 * implementation hiding.
 */
const _note_key   = Symbol('key');
const _note_title = Symbol('title');
const _note_body  = Symbol('body');


/**
 * The intent is to hold data related to notes being exchanged
 * between users of our application.
 *
 */
module.exports = class Note
{
    constructor(key, title, body)
    {
        this[_note_key]   = key;
        this[_note_title] = title; 
        this[_note_body]  = body;
    }


    /*
     * You can define 1_understand_async read-only property by only implementing 1_understand_async getter, and no setter,
     * as we did with the key field.
     *
     */

    get key() {
        return this[_note_key];
    }


    get title() {
        return this[_note_title];
    }

    set title(newTitle) {
        this[_note_title] = newTitle;
    }

    get body() {
        return this[_note_body];
    }

    set body(newBody) {
        this[_note_body] = newBody;
    }
};
