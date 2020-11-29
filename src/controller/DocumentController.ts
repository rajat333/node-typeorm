import {Request, Response} from "express";
import {getManager} from "typeorm";
import {Photos } from "../entity/Photos";
import { sizes } from '../middleware/userpic-upload';
export async function addPhoto(photos: any, user: any) {
    // get a post repository to perform operations with post
    const photoRepository = getManager().getRepository(Photos);
    const photoArray = [];
    console.log('user_id user_id user ', user);
    for(let i=0; i< sizes.length; i++){
        
       console.log('@@@@@@@', photos[sizes[i].path].filename);
       console.log('#######',photos[sizes[i].path].path);
        const photo = await photoRepository.createQueryBuilder('photo')
        .where("s3Key = :s3Key", {
            s3Key:  photos[sizes[i].path].path,
          }).getOne();
        console.log('photo photo', photo);
        if( ! photo ){
            console.log('in if if if ');
            const newPhoto = new Photos();
            newPhoto.name= photos[sizes[i].path].filename;
            newPhoto.user_id = user;
            newPhoto.type = sizes[i].path;
            newPhoto.s3Key = photos[sizes[i].path].path;
            await photoRepository.save(newPhoto);
        }   
    };
    console.log('for loop closed');
    // return loaded posts
    return photoArray;
}

export async function getUserPhotos(user_id: number){
    const photoRepository = getManager().getRepository(Photos);
    return await photoRepository.findByIds([user_id]);
}