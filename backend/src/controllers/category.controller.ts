import { Category } from "../models/Category";
import { Request, Response } from "express";
import {
    addCategory,
    deleteCategory,
    getAllCategories,
    getCategoryById,
    getCategoryBySlug,
    updateCategory,
} from "../services/category.service";
import { generateSlug } from "../shared/general.util";
import { z } from 'zod';
import { User } from "../models/User";
import { deletePost, getAllPosts } from "../services/post.service";
import { deletePostTagRelations  } from "../services/post-tag.service";
import { deletePostComment } from "../services/comment.service";


export const getCategories = async (req: Request, res: Response) => {
    const user:User=(req as any).user;
   
    const categories = await getAllCategories( {userId : user.get('id')});
    res.json(categories);
};

export const addCategoriesController = async (req: Request, res: Response) => {
    const schema = z.object({
        name: z.string()
    })
    const schemaValidator = schema.safeParse(req.body);
    if (!schemaValidator.success) {
        return res.status(400).json({ message: 'Invalid data', errors: schemaValidator.error })
    }
    const user:User=(req as any).user;
    const { name } = req.body;
    const userId = user.get('id');
    let slug = generateSlug(name);
    const categoryBySlug = await getCategoryBySlug(slug);
    if (categoryBySlug) {
        slug = generateSlug(name, true);
    }
    const category = await addCategory(name, slug, userId);

    // const categories = await getAllCategories();
    return res.json(category);
};

export const updateCategoryController = async (req: Request, res: Response) => {
    const schema = z.object({
        name: z.string(),
        id: z.number()
    });

    const schemaValidator = schema.safeParse(req.body);
    if (!schemaValidator.success) {
        return res.status(400).json({ message: 'Invalid data', errors: schemaValidator.error })
    }

    let { name, id } = req.body;

    let slug = generateSlug(name);

    const categoryBySlug = await getCategoryBySlug(slug);

    if (categoryBySlug) {
        res.status(400).json({ message: 'Category already exists' })
    }

    // check if category exist by the given id
    let dbCategory = await getCategoryById(id);

    if (!dbCategory) {
        res.status(404).json({ message: 'Category not found' })
    }

    // update the category
    let updatedCategory = await updateCategory(name, slug, id);


    return res.json(updatedCategory);
}


export const deleteCategoryController =  async (req: Request, res: Response) => {
    const schema = z.object({
        id: z.number()
    });

    const schemaValidator = schema.safeParse(req.body);
    if (!schemaValidator.success) {
        return res.status(400).json({ message: 'Invalid data', errors: schemaValidator.error })
    }

    const { id } = schemaValidator.data;

    const category = await getCategoryById(id);
    if (!category) {
        res.status(404).json({ message: "Category not found" })
    }

    const posts=await getAllPosts({
        categoryId:id
    });

    const postIds=posts.map((post)=>post.get('id'));

    await deletePostTagRelations({postId:postIds});
    await deletePostComment(postIds)
     await deletePost(postIds);
    await deleteCategory(id)
    return res.json(category)

}

export const getCategoryBySlugController=async(req:Request,res:Response)=>{
    const slug=req.params['slug'];
    const category=await getCategoryBySlug(slug);

    if(!category){
        return res.status(400).json({message:"Category not found"});
    }

    return res.status(200).json(category);
}