import { Sequelize } from "sequelize";
import { Comment } from "../models/Comment"
import { User } from "../models/User";

export const getPostComments = async (postId: number) => {
    return Comment.findAll({
        include:[{
            model:User,
            attributes:{
                exclude:['password']
            }
        }],
        where: {
            postId
        }
    })
}

export const addComment = async (postId: number, userId: number, content: string) => {
    const comment = new Comment();
    comment.postId = postId;
    comment.userId = userId;
    comment.content = content;
    return comment.save();
}

export const getCommentById = async (commentId: number) => {
    return Comment.findByPk(commentId);
}

export const updateComment = async (commentId: number, content: string) => {
    const comment = await getCommentById(commentId);
    if (!comment) {
        throw new Error("Comment not found");
    }


    comment.content = content;
    return comment.save()
}

export const deleteComment = async (commentId: number) => {
    const comment = await getCommentById(commentId);
    if (!comment)
        throw new Error("Comment not found");

    await comment.destroy();
    return comment;
}



export const deletePostComment = async (postId: number|number[]) => {
return Comment.destroy({
    where:{
        postId
    }
})
}

export const getTotalCommentsByPostIds=async (postIds:number[])=>{
    return Comment.findAll({
        attributes:['postId',[
            Sequelize.fn("COUNT",Sequelize.col('id')),'totalComments'
        ]],
        where:{
            postId:postIds
        },
        group:['postId']
        
    })
}