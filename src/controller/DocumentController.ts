import {Request, Response} from "express";
import {getManager} from "typeorm";
import {Photos } from "../entity/Photos";

export async function addPhoto(photos, user_id = 0) {
    // get a post repository to perform operations with post
    const photoRepository = getManager().getRepository(Photos);
    const photoArray = [];
    photos.map( async (e)=>{

        const photo = await photoRepository.find({ s3Key: e.s3Key });
        if(! photo){
            const newPhoto = new Photos();
            newPhoto.name= e.name;
            newPhoto.s3Key = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
            await photoRepository.save(newPhoto);
            photoArray.push(newPhoto);            
        }   
    });
    // return loaded posts
    return photoArray;
}

export async function getUserPhotos(user_id: number){
    const photoRepository = getManager().getRepository(Photos);
    return await photoRepository.findByIds([user_id]);
}