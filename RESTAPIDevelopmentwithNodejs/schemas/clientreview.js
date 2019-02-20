module.exports = {
    "id": "ClientReview",
    "properties": {
        "client": {
            "$ref": "Client",
            "description": "The"
        },
        "book": {
            "$ref": "Book",
            "description": "The"
        },
        "review_text": {
            "type": "string",
            "description": "The"
        },
        "stars": {
            "type": "integer",
            "description": "The",
            "min": 0,
            "max": 5
        }
    }
};
