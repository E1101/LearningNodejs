/*
 * With the Note class, we have used Symbol instances to provide a small measure of data hiding.
 * JavaScript classes don't provide a data-hiding mechanism—you can't label a field private as
 * you can in Java, for example.
 *
 * Each time you invoke the Symbol factory method, a new and unique instance is created. For example,
 * Symbol('foo') === Symbol('foo') is false
 *
 * >> The bottom line is that using Symbol objects for the fields provides a small measure of
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
     * You can define a read-only property by only implementing a getter, and no setter,
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
