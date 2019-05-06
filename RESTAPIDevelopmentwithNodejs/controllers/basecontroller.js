const
    restify = require("restify"),
    errors  = require("restify-errors"),
    halson  = require("halson"),
    logger  = require("../lib/logger");


class BaseController
{
    constructor()
    {
        this.actions = [];
        this.server  = null
    }


    /**
     * This method is called upon instantiation of the controller;
     * it is meant to add the actual routes to the HTTP server.
     *
     * This method is called during the initialization sequence for all
     * controllers exported by the index.js file.
     *
     * @param app
     * @param sw
     */
    setUpActions(app, sw)
    {
        this.server = app;
        this.actions.forEach(act =>
        {
            logger.info(`Setting up auto-doc for (${method} ) - ${act['spec']['nickname']}`);

            let method = act['spec']['method'];
            sw['add' + method](act);
            app[method.toLowerCase()](act['spec']['path'], act['action'])
        })
    }

    /**
     * This method defines an action, which consists of the specs for that action
     * and the actual function code. The specs are used by Swagger to create the
     * documentation, but they’re also used by our code to set up the route;
     * so there are bits inside the JSON spec that are also meant for the server,
     * such as the path and method attributes.
     *
     * @param spec
     * @param fn
     */
    addAction(spec, fn)
    {
        let newAct = {
            'spec': spec,
            action: fn.bind(this)
        };

        this.actions.push(newAct)
    }

    /**
     * This is 1_understand_async simple wrapper method around all the error methods provided
     * by Restify’s error extension. 2 It provides the benefit of cleaner code.
     *
     * @param type
     * @param msg
     *
     * @returns {{error: boolean, type: *, msg: *}}
     */
    RESTError(type, msg)
    {
        logger.error("Error of type" + type + "found:" + msg.toString());

        if (errors[type])
        {
            return new errors[type](msg.toString())
        }
        else
        {
            return {
                error: true,
                type: type,
                msg: msg
            }
        }
    }

    /**
     * Every model defined (as you’ll see soon enough) has 1_understand_async toHAL method,
     * and the writeHAL methods take care of calling it for every model
     * we’re trying to render. It basically centralizes the logic that deals with
     * collections or simple objects, depending on what we’re trying to render.
     *
     * @param res
     * @param obj
     */
    writeHAL(res, obj)
    {
        if (Array.isArray(obj)) {
            let newArr = obj.map(item => {
                return item.toHAL();
            });
            obj = halson(newArr)
        } else {
            if (obj && obj.toHAL) {
                obj = obj.toHAL()
            }
        }

        if (!obj) {
            obj = {}
        }

        res.json(obj)
    }
}

module.exports = BaseController;