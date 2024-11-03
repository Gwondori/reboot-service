import express from "express";
import logger from "morgan";
import cookieParser from "cookie-parser";
import serviceRouter from "./router/index.js";

/**
 * @class ServiceHost
 * @description Control Server
 * @param {number} port
 * @param {string} host
 */
class ServiceHost {
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
     * @type {boolean}
     * @private
     */
    #status;

    constructor( port=8081, host="localhost" ) {
        this.#port = port;
        this.#host = host;
    }

    /**
     * @method start
     * @description Start Service Server
     * @returns {void}
     * @public
     */
    start() {
        this.#app = express();
        this.#app.use(logger('dev'));
        this.#app.use(express.json());
        this.#app.use(express.urlencoded({ extended: false }));
        this.#app.use(cookieParser());

        this.#app.use( "/", serviceRouter );

        this.#http = this.#app.listen( this.#port, this.#host, () => {
            console.log( `Service Server started at http://${this.#host}:${this.#port}` );
            this.#status = true;
        } );

    }

    stop() {
        this.#http.closeAllConnections();
        this.#http.close( ( err ) => {
            if( err )
            {
                console.error( err );
                process.exit( 1 );
            }
        } );

        this.#status = false;
    }

    get status() {
        return this.#status;
    }
}

export default ServiceHost;