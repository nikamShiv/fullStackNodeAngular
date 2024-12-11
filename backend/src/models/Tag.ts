
import { Table,Model,Column, BelongsTo, BelongsToMany, ForeignKey } from "sequelize-typescript";

import { Post } from "./Post";
import { PostTag } from "./PostTag";
import { User } from "./User";



@Table
export class Tag extends Model<Tag>{

    @Column
    ({
        allowNull:false
    })
    name!:string;

    @Column({
      unique:true,
      allowNull:false
  })
  slug!:string;
    
  @ForeignKey(()=>User)
  @Column({
   allowNull:false
    })
  userId?:number;

  @BelongsToMany(()=>Post, ()=>PostTag)
  posts:Post[]=[]


  @BelongsTo(()=>User)
  user?:User
}
