import { IPost } from "./models/post.model.interface";
import { ITag } from "./models/tag.model.interface";

export interface IPostTag{
    postId:number;
    tagId:number;
    post:IPost;
    tag:ITag;
    createdAt:string;
    updatedAt:string;
}