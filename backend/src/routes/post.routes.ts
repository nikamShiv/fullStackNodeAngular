import { Router } from "express";
import { addPostController, deletePostController, getPostBySlugController, getPostController, updatePostController } from "../controllers/post.controller";
import { authenticateJWT, authenticateOptional } from "../shared/auth.util";

const router=Router();


router.get('/',authenticateOptional,getPostController)
router.get('/slug/:slug',getPostBySlugController)
router.post('/',authenticateJWT,addPostController)
router.put('/',authenticateJWT,updatePostController)
router.delete('/',authenticateJWT,deletePostController)


export default router;