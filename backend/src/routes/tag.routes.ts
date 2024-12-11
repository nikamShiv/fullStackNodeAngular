import { Router } from "express";
import {  addTagController,getPostTagsController,getTagBySlugController, getTagController,updateTagController ,deleteTagController} from "../controllers/tag.controller";
import { authenticateJWT } from "../shared/auth.util";

const router=Router();


router.get('/',authenticateJWT,getTagController)
router.get('/getPostTagRelations/:postId', getPostTagsController);
router.get('/getTagBySlug/:slug', getTagBySlugController);

router.post('/',authenticateJWT,addTagController)
router.put('/',authenticateJWT,updateTagController)
router.delete('/',authenticateJWT,deleteTagController)


export default router;