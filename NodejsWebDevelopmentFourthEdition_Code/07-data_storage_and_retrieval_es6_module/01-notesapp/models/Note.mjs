const _note_key   = Symbol('key');
const _note_title = Symbol('title');
const _note_body  = Symbol('body');


export default class Note
{
    constructor(key, title, body)
    {
        this[_note_key] = key; 
        this[_note_title] = title; 
        this[_note_body] = body; 
    }


    static fromJSON(json)
    {
        let data = JSON.parse(json);

        return new Note(data.key, data.title, data.body);
    }


    get key()
    {
        return this[_note_key];
    }

    get title()
    {
        return this[_note_title];
    }

    set title(newTitle)
    {
        this[_note_title] = newTitle;
    }

    get body()
    {
        return this[_note_body];
    }

    set body(newBody)
    {
        this[_note_body] = newBody;
    }


    get JSON()
    {
        return JSON.stringify({ 
            key:   this.key,
            title: this.title,
            body:  this.body
        });
    }
}
