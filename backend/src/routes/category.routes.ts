import { Router } from "express";
import { addCategoriesController,getCategoryBySlugController, deleteCategoryController, getCategories, updateCategoryController } from "../controllers/category.controller";
import { authenticateJWT, authenticateOptional } from "../shared/auth.util";

const router=Router();


router.get('/',authenticateOptional,getCategories)
router.post('/',authenticateJWT,addCategoriesController)
router.put('/',updateCategoryController)
router.delete('/',deleteCategoryController)
router.get('/slug/:slug',getCategoryBySlugController)



export default router;