import { IUser } from "./users.model.interface"


export interface IComments{
    id: number,
    content: string,
    userId: number,
    postId: number,
    user:IUser,
    createdAt: string,
    updatedAt: string
}