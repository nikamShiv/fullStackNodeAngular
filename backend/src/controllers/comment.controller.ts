import { Request, Response } from "express"
import { z } from "zod"
import { getPostById } from "../services/post.service";
import { addComment, deleteComment, getCommentById, getPostComments, updateComment } from "../services/comment.service";
import { User } from "../models/User";

export const getAllCommentsController = async (req: Request, res: Response) => {
    const schema = z.object({
        postId: z.number()
    })

    const safeData = schema.safeParse({
        postId: parseInt(req.params.postId)
    });

    if (!safeData.success) {
        console.log('safeData', safeData)
        return res.status(400).json(safeData.error)
    }


    const { postId } = safeData.data;

    const post = await getPostById(postId)

    if (!post) {
        return res.json(400).json({ messsage: "Invalid post id" });

    }

    const comments = await getPostComments(postId);

    return res.json(comments);
}


export const addCommentController = async (req: Request , res: Response) => {
    const schema = z.object({
        postId: z.number(),
        content: z.string()
    })

const user:User=(req as any).user;
    const safeData = schema.safeParse(req.body);
    if (!safeData.success)
        return res.status(400).json(safeData.error)

    const { postId, content } = safeData.data;
    const userId = user.get('id'); // hardcoded user id

    const post = await getPostById(postId);

    if (!post) {
        return res.status(400).json({
            message: "Invalid post id"
        })
    }

    const comment = await addComment(postId, userId, content);

    return res.json(comment);
}

export const updateCommentController = async (req: Request, res: Response) => {
    const schema = z.object({
        content: z.string(),
        commentId: z.number()
    })


    const safeData = schema.safeParse(req.body);
    if (!safeData.success)
        return res.status(400).json(safeData.error)

    const user:User=(req as any).user;
    const { commentId, content } = safeData.data;
    const userId = user.get('id');

    const comment = await getCommentById(commentId);

    if (!comment) {
        return res.status(400).json({ message: "Invalid comment id" });
    }
    if (comment.userId !== userId) {
        return res.status(400).json({
            message: "You are not the owner of the comment"
        });
    }

    const updatedComment = await updateComment(commentId, content);

    return res.json(updatedComment)
}

export const deleteCommentController = async (req: Request, res: Response) => {
    const schema = z.object({
        commentId: z.number()
    });

    const safeData = schema.safeParse(req.body);

    if (!safeData.success) {
        return res.status(400).json(safeData.error)
    }
    const user:User=(req as any).user;
    const { commentId } = safeData.data;
    const userId = user.get('id');

    const comment = await getCommentById(commentId);
    if (!comment) {
        return res.status(400).json({ message: "Invalid comment id" });
    }

    // check if current user is the owner of the comment
    if (comment.userId !== userId) return res.status(400).json({ message: "You are not the owner of the comment" });

    // delete the comment
    await deleteComment(commentId);

    return res.json(comment);
}