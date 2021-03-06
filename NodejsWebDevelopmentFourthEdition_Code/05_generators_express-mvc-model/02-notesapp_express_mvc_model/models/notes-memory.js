'use strict';

const util = require('util');
const Note = require('./Note');

let notes = [];

/*
 * The create and update functions are being handled by the same function.
 */
exports.update = exports.create = async function(key, title, body)
{
    notes[key] = new Note(key, title, body);

    return notes[key];
};

exports.read = async function(key)
{
    if (notes[key])
        return notes[key];
    else
        throw new Error(`Note ${key} does not exist`);
};

exports.destroy = async function(key)
{
    if (notes[key])
        delete notes[key];
    else
        throw new Error(`Note ${key} does not exist`);
};

exports.keylist = async function()
{
    return Object.keys(notes);
};

exports.count   = async function()
{
    return notes.length;
};

exports.close = async function() { };
