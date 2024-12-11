import { Request, Response } from "express";
import { addTag, deleteTag, getAllTags, getTagById, getTagBySlug, updateTag } from "../services/tags.service";
import { z } from "zod";
import { generateSlug } from "../shared/general.util";
import { getPostById } from "../services/post.service";
import { deletePostTagRelations, getPostTags } from "../services/post-tag.service";
import { User } from "../models/User";


export const getTagController = async (req: Request, res: Response) => {
    const user:User=(req as any).user;

    const tags = await getAllTags({ userId : user.get('id')});

    return res.json(tags);
}

export const addTagController = async (req: Request, res: Response) => {
    const schema = z.object({
        name: z.string()
    });

    const schemaValidator = schema.safeParse(req.body);

    if (!schemaValidator.success) return res.status(400).json({ message: 'Invalid data', errors: schemaValidator.error })


    const { name } = req.body;

    let slug = generateSlug(name);

    const tagAlreadyExists = await getTagBySlug(slug);

    if (tagAlreadyExists) {
        slug = generateSlug(name, true);
    }

    const newTag = await addTag(name, slug, 1);

    return res.json(newTag);
}

export const updateTagController = async (req: Request, res: Response) => {
    const schema = z.object({
        name: z.string(),
        id: z.number()
    });

    const schemaValidator = schema.safeParse(req.body);

    if (!schemaValidator.success) return res.status(400).json({ message: 'Invalid data', errors: schemaValidator.error })

    const { name, id } = req.body;

    const tag = await getTagById(id);

    if (!tag) return res.status(404).json({ message: 'Tag not found' });
    if (tag.name === name) return res.status(400).json({ message: 'Nothing was changed.' });



    let slug = generateSlug(name);
    const tagAlreadyExists = await getTagBySlug(slug);
    if (tagAlreadyExists) {
        slug = generateSlug(name, true)
    }

    // tag.name = name;
    // tag.slug = slug;
    // await tag.save();
    let updatedPost = await updateTag(name, slug, id);


    res.json(updatedPost);
    // return res.json(tag);

}

export const deleteTagController=async(req:Request,res:Response)=>{
    const schema = z.object({
        id: z.number()
    });

    const schemaValidator = schema.safeParse(req.body);
    if (!schemaValidator.success) {
        return res.status(400).json({ message: 'Invalid data', errors: schemaValidator.error })
    }

    const { id } = req.body;

    const tags = await getTagById(id);
    if (!tags) {
        res.status(404).json({ message: "Tag not found" })
    }
await deletePostTagRelations({tagId:id})
    await deleteTag(id)
    res.json(tags)
}

export const getPostTagsController=async(req:Request,res:Response)=>{
    const postId=parseInt(req.params.postId);

    if(!postId){
        return res.status(400).json({message:"Post id is requried"});
    }
    const post=await getPostById(postId);
    if(!post){
        return res.status(400).json({message:"Post not found"});
    }

    const postTags=await getPostTags(postId);
    if(!postTags){
        return res.status(400).json({message:"Post tags not found"});
    }
    return res.json(postTags);
}

export const getTagBySlugController=async(req:Request,res:Response )=>{
    const {slug}=req.params;
    const tag=await getTagBySlug(slug);

    if(!tag){
        return res.status(400).json({message:"Tag not found"});
    }

    return res.json(tag);
}