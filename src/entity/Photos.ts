import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";
import { User } from "./User";

@Entity()
export class Photos {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    type: string;
    
    @Column()
    s3Key: string;

    @ManyToOne(() => User, user => user.photos)
    user_id: User;
}
