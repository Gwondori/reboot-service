import http from "node:http";
import express from "express";
import logger from "morgan";
import cookieParser from "cookie-parser";
import ctrlRouter from "./router/index.js";
import ServiceHost from "../service-host/service-host.js";

/**
 * @class CtrlHost
 * @description Control Server
 * @param {number} port
 * @param {string} host
 */
class CtrlHost {
    /**
     * @type {http.Server}
     * @private
     */
    #http;
    /**
     * @type {Express}
     * @private
     */
    #app;
    /**
     * @type {number}
     * @private
     */
    #port;
    /**
     * @type {string}
     * @private
     */
    #host;
    /**
     * @type {ServiceHost}
     * @private
     */
    #serviceHost;

    constructor( port = 8080, host = "localhost" ) {
        this.#port = port;
        this.#host = host;
    }

    /**
     * @method start
     * @description Start Control Server
     * @returns {void}
     * @public
     */
    start() {
        this.#app = express();
        this.#app.use( logger( "dev" ) );
        this.#app.use( express.json() );
        this.#app.use( express.urlencoded( { extended: false } ) );
        this.#app.use( cookieParser() );

        this.#app.use( "/", ctrlRouter );
        this.#app.use( "/service", this.#serviceHostRouter() );

        this.#http = this.#app.listen( this.#port, this.#host, () => {
            console.log( `Control Server started at http://${this.#host}:${this.#port}` );
        } );

        this.#serviceHost = new ServiceHost();
        this.#serviceHost.start();
    }

    /**
     * @method serviceHostRouter
     * @description Router for control to service host.
     * @returns {Router}
     */
    #serviceHostRouter() {
        const ctrlServiceRouter = express.Router();

        ctrlServiceRouter.post( "/stop", ( req, res ) => {
            if( this.#serviceHost.status === false )
            {
                res.send( { message: "Service already stopped" } );
            }
            else
            {
                this.#serviceHost.stop();
                res.send( { message: "Service stopped" } );
            }
        } );

        ctrlServiceRouter.post( "/start", ( req, res ) => {
            if( this.#serviceHost.status === true )
            {
                res.send( { message: "Service already started" } );
            }
            else
            {
                this.#serviceHost.start();
                res.send( { message: "Service started" } );
            }
        } );

        return ctrlServiceRouter;
    }
}

export default CtrlHost;