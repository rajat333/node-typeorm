import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";
import { Skills } from  './Skills';
import { Photos } from "./Photos";
@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    profileDescription: string;

    @Column()
    auth0Id: string;

    @Column()
    city: string;

    @OneToMany(() => Skills, skill => skill.user_id)
    skills: Skills[];

    @OneToMany(() => Photos, photo => photo.user_id)
    photos: Photos[];
    
}
