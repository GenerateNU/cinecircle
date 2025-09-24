import { Router } from 'express';
import { 
  getUserProfile,
  updateUserProfile,
  updateUserBio,
  updateUserFavorites
} from '../controllers/user.ts';
import { authenticate } from '../middleware/auth.ts';

const router = Router();

router.get('/profile', authenticate, getUserProfile);
router.put('/profile', authenticate, updateUserProfile);
router.patch('/profile/bio', authenticate, updateUserBio);
router.patch('/profile/favorites', authenticate, updateUserFavorites);

export default router;
