import { ICategory } from "./category.model.interface";
import { IUser } from "./users.model.interface";

export interface IPost{
    id:number;
    title:string;
    content:string;
    slug:string;
    userId:string;
    category:ICategory;
    totalComments?:number;
    user:IUser;
    categoryId:number;
    createdAt:string;
    updatedAt:string;
}