import { Router } from "express";
import { loginController,resetPasswordController, registerController,forgotPasswordController ,refreshTokenController,logoutController,confirmEmailController} from "../controllers/auth.controller";


const router=Router();

router.post('/register',registerController)
router.post('/login',loginController)
router.post('/refresh-token',refreshTokenController)
router.post('/logout',logoutController)
router.get('/confirm-email/:token',confirmEmailController)
router.post('/forgot-password',forgotPasswordController)
router.post('/reset-password',resetPasswordController)





export default router;