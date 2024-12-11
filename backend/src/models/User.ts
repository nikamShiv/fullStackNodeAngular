import { Comment } from './Comment';
import { Column, DataType, Default, HasMany, Model, Table } from "sequelize-typescript";
import { Post } from "./Post";
import { Token } from './Token';
import { Category } from './Category';
import { Tag } from './Tag';



@Table
export class User extends Model {
    @Column({
        allowNull: false
    })
    name!: string; // Avoid setting default values here.

    @Column({
        unique: true,
        allowNull: false
    })
    email!: string;

    @Default('pending')
    @Column({
        allowNull: false,
        type: DataType.ENUM('active', 'pending')
    })
    status!: string

    @Column({
        allowNull: false
    })
    password!: string;

    @HasMany(() => Post)
    posts: Post[] = []


    @HasMany(() => Comment)
    comments: Comment[] = []

    @HasMany(() => Token)
    tokens: Token[] = []

    @HasMany(() => Category)
    categories: Category[] = []

    @HasMany(() => Tag)
    tags: Tag[] = []
}
