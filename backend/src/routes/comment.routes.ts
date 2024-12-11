import { Router } from "express";
import { getAllCommentsController, addCommentController, updateCommentController, deleteCommentController } from "../controllers/comment.controller";
import { authenticateJWT } from "../shared/auth.util";


const router=Router();

router.get('/:postId',getAllCommentsController)
router.post('/',authenticateJWT,addCommentController)
router.put('/',authenticateJWT,updateCommentController)
router.delete('/',authenticateJWT,deleteCommentController)
export default router;