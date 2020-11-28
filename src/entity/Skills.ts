import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";
import { User } from "./User";

@Entity()
export class Skills {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    
    @Column()
    isActive: boolean;

    @ManyToOne(() => User, user => user.skills)
    user_id: User;

}
