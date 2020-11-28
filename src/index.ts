import "reflect-metadata";
import {createConnection, Connection} from "typeorm";
import * as bodyParser from "body-parser";
import * as express from "express";
import {Request, Response} from "express";
import {Routes} from "./route";
import {User} from "./entity/User";
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

    // register all application routes
    Routes.forEach(route => { 
    (app as any)[route.method](route.route, (req:   Request, res: Response, next: Function) => { 
        const result = (new (route.controller as any))[route.action](req, res, next); 
        if (result instanceof Promise) { 
           result.then(result => result !== null && result !== undefined ? res.send(result) : undefined); 
        } else if (result !== null && result !== undefined) { 
           res.json(result); 
        } 
     });
    });
    // const route = AppRoutes;
    // (app as any)[route.method](route.route, (req:   Request, res: Response, next: Function) => { 
    //     const result = (new (route.controller as any))[route.action](req, res, next); 
    //     if (result instanceof Promise) { 
    //        result.then(result => result !== null && result !== undefined ? res.send(result) : undefined); 
    //     } else if (result !== null && result !== undefined) { 
    //        .json(result); 
    //     } 
    //  });

    // run app
    app.listen(3000);

    console.log("Express application is up and running on port 3000");

    console.log("Inserting a new user into the database...");
    // const skillAdded = await addSkill(connection);
    // const photoAdded = await addPhotos(connection);
    // const user = new User();
    // user.name = "Timber";
    // user.profileDescription = "profileDescription";
    // user.auth0Id = Math.random().toString();
    // user.email = 'rajattest@yopmail.com'
    // user.city = 'Test';
    // user.skills =skillAdded;
    // user.photos = photoAdded;
    // await connection.manager.save(user);
    // console.log("Saved a new user with id: " + user.id);
    console.log("Loading users from the database...");
    const users = await connection.manager.find(User);
    console.log("Loaded users: ", users);

    console.log("Here you can setup and run express/koa/any other framework.");

}).catch(error => console.log(error));
