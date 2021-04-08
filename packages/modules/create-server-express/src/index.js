import {isDevelopment, isTest} from '@mykaelo/utils-env';
import express from 'express';
import helmet from 'helmet';
import responseTime from 'response-time';
import morgan from 'morgan';


/**
 * @typedef DefaultExpressOptions
 * @type {Object} options
 * @property {Array.<Function>} middlewares - The middlewares after
 * @property {Array.<Function>} routers - The routers to use
 * @property {String=''} prefix - The common prefix for all routes
 */

/**
 * It creates a ExpressJS server with default
 * middlewares loaded
 * It can set aditional middlewares, routes and
 * default prefix application
 * @async
 * @function
 * @param {DefaultExpressOptions} options - Default options
 * @return {Promise} - Express Application
 */
export default async ({
  middlewares = [],
  routers = [],
  prefix = '',
}) => {
  
  const app = express();

  app.use([
    defaultMiddlewares(),
    ...middlewares,
  ]);

  routers.forEach((router) => {
    app.use(prefix, router);
  });

  // Created async for future DB task migrations/seeders
  return Promise.resolve(app);
};

/**
 * It creates the default middlewares for
 * the Express Application
 *
 * @return {Array<Function>} - The default Express Middlewares
 */
const defaultMiddlewares = () => ([
  helmet(),
  express.json({
    limit: '5mb',
    strict: true,
    inflate: true,
  }),
  express.urlencoded({
    extended: true,
    inflate: true,
    limit: '5mb',
  }),
  responseTime(),
  morgan('dev', {
    skip: (req, res) =>
      isDevelopment() || isTest() ?
        false :
        res.statusCode < 400,
  }),
]);
