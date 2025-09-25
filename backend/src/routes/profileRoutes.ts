import { Router } from 'express';
import { 
  getUserProfile,
  updateUserProfile,
  updateUserBio,
  updateUserFavorites
} from '../controllers/user';
import { authenticateUser } from '../middleware/auth';

const router = Router();

router.get('/profile', authenticateUser, getUserProfile);
router.put('/profile', authenticateUser, updateUserProfile);
router.patch('/profile/bio', authenticateUser, updateUserBio);
router.patch('/profile/favorites', authenticateUser, updateUserFavorites);

export default router;
