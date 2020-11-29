import {Request, Response} from "express";
import {getManager, Connection} from "typeorm";
import {User } from "../entity/User";
import { addSkill , getSkill, removeSkill} from './SkillsController';
import { addPhoto, getUserPhotos } from  './DocumentController';
/**
 * Loads all posts from the database.
 */
export  class UserController {
    
    private userRepository = getManager().getRepository(User); 

    async getAllUsers(request: Request, response: Response) {
        const users = await this.userRepository.createQueryBuilder('user')
        .leftJoinAndSelect("user.photos", "photos")
       .leftJoinAndSelect("user.skills", "skills").getMany();
        response.send(users);
    }
    async createUser(request: Request, response: Response) {        
        const existUser = await this.getUserById1(request,response);
        if( existUser ){
            if(request.body.email && request.body.city){
            const updatedUser = await this.updateUser(request.body);
            }
            request.params.id = existUser.id.toString();
            await this.getUserById(request, response);
        }else{
            const user = new User();
            user.name = request.body.name ;
            user.profileDescription = request.body.profileDescription;
            user.auth0Id = request.body.auth0Id;
            user.email = request.body.email;
            user.city = request.body.city;
            await this.userRepository.save(user);
            request.params.id = user.id.toString();
            await this.getUserById(request, response);
        }
    }
    // Get User Based on Id
    async getUserById(request:Request , response: Response){
       const user =  await this.userRepository.createQueryBuilder('user')
       .leftJoinAndSelect("user.photos", "photos")
       .leftJoinAndSelect("user.skills", "skills")
       .where("user.id = :id", { id: request.params.id })
       .getOne();
       response.json(user); 
    }
    
    async getUserById1(request: Request, response: Response) {
        // get a post repository to perform operations with post
        const users = await this.userRepository.createQueryBuilder('user')
        .where("auth0Id = :auth0Id", {
          auth0Id:  request.body.auth0Id,
        }).getOne();
        return users;
    }
    async updateUser(bodyData){
        await this.userRepository.createQueryBuilder()
        .update(User)
        .set({ name: bodyData.name,
            email: bodyData.email,
            city: bodyData.city,
            profileDescription: bodyData.profileDescription,
         })
        .where("auth0Id = :auth0Id", { auth0Id: bodyData.auth0Id })
        .execute();        
        return await this.userRepository.createQueryBuilder('user')
        .where("auth0Id = :auth0Id", {
            auth0Id:  bodyData.auth0Id,
          }).getOne();     
    }

    async updateUserSkill(request: Request, response: Response){   
        const user = await this.getUserById1(request,response);
        const newSkills = await addSkill(user.id ,request.body.skillName);
        response.json({
            ...user,
            skills: newSkills,
        })
    }

    async uploadPic(request: Request, response: Response){

        request.body.auth0Id = request.headers['auth0id'];
        const user = await this.getUserById1(request,response);
        await addPhoto(request.body.cover[0], user);
        request.params.id = user.id.toString();
        await this.getUserById(request,response);
    }

    async removeSkill(request: Request, response:Response){
        const user = await this.getUserById1(request, response);
        await removeSkill(request.params.skillId);
        const responseUser =  await this.userRepository.createQueryBuilder('user')
       .leftJoinAndSelect("user.photos", "photos")
       .leftJoinAndSelect("user.skills", "skills")
       .where("user.id = :id", { id: user.id })
       .getOne();
       response.json(responseUser);
    }
    async checkToken(request: Request, response: Response){
        response.send({
          msg: "Your access token was successfully validated!",
        });
    }
}
