// @ts-nocheck
const Hapi = require('@hapi/hapi');
const routes = require('./routes');

/** anotasi JSDOC
 * @type {Array<Hapi.ServerRoute>}
 */

const init = async ()=>{
    const server = new Hapi.Server({
        port : 5000,
        host : process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
        // access cross allow origin. agar elemen dgn sumber yg beda tetap dapat diakses
        routes : {
            cors : {
                // menetapkan cors diaktifkan di seluruh route yg ada di server
                origin : ['*']
            }
        }
    });

    server.route(routes)

    await server.start();
    console.log(`server berjalan pada ${server.info.uri}`);
};
init();