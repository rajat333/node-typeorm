import "reflect-metadata";
import {createConnection, Connection} from "typeorm";
import * as bodyParser from "body-parser";
import * as express from "express";
import {Request, Response} from "express";
// import authConfig from '/auth_config.json';
const authConfig = require("./auth_config.json");
const cors = require('cors');
const helmet = require('helmet');

require('dotenv').config();
import {Routes} from "./route";
import { Skills } from "./entity/Skills";
import { Photos } from "./entity/Photos";

createConnection().then(async connection => {

    const app = express();
    app.use(bodyParser.json());
    const appOrigin = authConfig.appOrigin || `http://localhost:${process.env.APP_PORT}`;
    app.use(express.static(`${__dirname}/public`));
    app.use(cors({ origin: appOrigin }));
    app.use(helmet());

    // register all application routes
    Routes.forEach(route => { 
    (app as any)[route.method](route.route, 
        route.middleware,
        (req:   Request, res: Response, next: Function) => { 
        const result = (new (route.controller as any))[route.action](req, res, next); 
        if (result instanceof Promise) { 
           result.then(result => result !== null && result !== undefined ? res.send(result) : undefined); 
        } else if (result !== null && result !== undefined) { 
           res.json(result); 
        } 
     });
    });

    if (!authConfig.domain || !authConfig.audience) {
    throw new Error(
        "Please make sure that auth_config.json is in place and populated"
    );
    }

    // run app
    app.listen(process.env.PORT || 3001);

    console.log(`Express application is up and running on port ${process.env.PORT}`);
    console.log("Here you can setup and run express/koa/any other framework.");

}).catch(error => console.log(error));
