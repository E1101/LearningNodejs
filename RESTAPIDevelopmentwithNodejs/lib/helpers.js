const halson = require("halson"),
      config = require("config");

module.exports = {
    makeHAL:     makeHAL,
    setupRoutes: setupRoutes,
    validateKey: validateKey
};


// ..

/**
 * This function is called from within the project’s main file during
 * boot-up time. It’s meant to initialize all controllers, which in
 * turn adds the actual route’s code to the HTTP server.
 *
 * @param server
 * @param swagger
 * @param lib
 */
function setupRoutes(server, swagger, lib)
{
    for (controller in lib.controllers)
    {
        cont = lib.controllers[controller](lib);
        cont.setUpActions(server, swagger)
    }
}

/**
 * This function contains the code to validate the request by
 * recalculating the HMAC key. And as mentioned earlier, it
 * contains the exception to the rule, allowing any request to
 * validate if the key sent is 777
 *
 * @param hmacdata
 * @param key
 * @param lib
 *
 * @returns {boolean}
 */
function validateKey(hmacdata, key, lib)
{
    //This is for testing the swagger-ui, should be removed after development to avoid possible security problem :)
    if (+key == 777)
        return true;

    let hmac = require("crypto").createHmac("md5", config.get('secretKey'))
        .update(hmacdata)
        .digest("hex");

    return hmac == key;
}

/**
 * This function turns any type of object into 1_understand_async HAL JSON
 * object ready to be rendered. This particular function is heavily
 * used from within the models’ code.

 * @param data
 * @param links
 * @param embed
 *
 * @returns {*}
 */
function makeHAL(data, links, embed)
{
    let obj = halson(data);

    if (links && links.length > 0) {
        links.forEach( lnk => {
            obj.addLink(lnk.name, {
                href: lnk.href,
                title: lnk.title || ''
            })
        })
    }

    if (embed && embed.length > 0) {
        embed.forEach( item => {
            obj.addEmbed(item.name, item.data)
        })
    }

    return obj
}
