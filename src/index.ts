import "reflect-metadata";
import {createConnection, Connection} from "typeorm";
import * as bodyParser from "body-parser";
import * as express from "express";
import {Request, Response} from "express";
require('dotenv').config();
import {Routes} from "./route";
import { Skills } from "./entity/Skills";
import { Photos } from "./entity/Photos";

const addSkill = async (connection)=>{
    let firstSkill = new Skills();
    firstSkill.name= "Testing";
    firstSkill.isActive = true;
    await connection.manager.save(firstSkill);
    let secondSkill = new Skills();
    secondSkill.name= "Developer";
    secondSkill.isActive = true;
    await connection.manager.save(secondSkill);
    return [firstSkill, secondSkill];
};

const addPhotos = async(connection)=>{
    let firstPhoto = new Photos();
    firstPhoto.name= "Testing";
    firstPhoto.s3Key = `ADM/OH/${new Date()}`;
    await connection.manager.save(firstPhoto);
    let secondPhoto = new Photos();
    secondPhoto.name= "Developer";
    secondPhoto.s3Key = `ADM/TL/PM/${new Date()}`;
    await connection.manager.save(secondPhoto);
    return [firstPhoto, secondPhoto];
};

createConnection().then(async connection => {

    const app = express();
    app.use(bodyParser.json());
    app.use(express.static(`${__dirname}/public`));
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
    // run app
    app.listen(process.env.PORT || 3001);

    console.log(`Express application is up and running on port ${process.env.PORT}`);
    console.log("Inserting a new user into the database...");
    console.log("Here you can setup and run express/koa/any other framework.");

}).catch(error => console.log(error));
