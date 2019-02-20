class Note
{
    constructor(key, title, body) {
        this._key   = key;
        this._title = title;
        this._body  = body;
    }


    // The functions marked with get or set keywords are getters and setters, used like so:
    // var aNote = new Note("key", "The Rain in Spain", "Falls mainly on the plain");
    // var key = aNote.key;
    // aNote.title = "The Rain in Spain, which made me want to cry with joy";

    get key() {
        return this._key;
    }

    get title() {
        return this._title;
    }

    set title(newTitle) {
        return this._title = newTitle;
    }

    get body() {
        return this._body;
    }

    set body(newBody) {
        return this._body = newBody;
    }
}

class LoveNote
    extends Note
{
    constructor(key, title, body, heart) {
        super(key, title, body);
        this._heart = heart;
    }

    get heart() {
        return this._heart;
    }

    set heart(newHeart) {
        return this._heart = newHeart;
    }
}
