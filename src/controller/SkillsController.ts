import {Request, Response} from "express";
import {getManager} from "typeorm";
import {Skills } from "../entity/Skills";

export async function addSkill(userId,skillName) {
    // get a post repository to perform operations with post
    const skillRepository = getManager().getRepository(Skills);
    const newSkill = new Skills();
    newSkill.name= skillName;
    newSkill.user_id = userId;
    newSkill.isActive = true;
    await skillRepository.save(newSkill);
    return await getSkill(userId);
    // return newSkill;
}

export async function getSkill(userId) {
    // get a post repository to perform operations with post
    const skillRepository = getManager().getRepository(Skills);
    return await skillRepository.createQueryBuilder('skill')
    .where('skill.user_id = :user_id', { user_id: userId }).getMany();
   
}
 