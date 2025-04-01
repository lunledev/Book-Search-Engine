import express from 'express';
const router = express.Router();
import {
  createUser,
  getSingleUser,
  saveBook,
  deleteBook,
  login,
} from '../../controllers/user-controller.js';

// import middleware
import { authenticationToken } from '../../services/auth.js';

// put authMiddleware anywhere we need to send a token for verification of user
router.route('/').post(createUser).put(authenticationToken, saveBook);

router.route('/login').post(login);

router.route('/me').get(authenticationToken, getSingleUser);

router.route('/books/:bookId').delete(authenticationToken, deleteBook);

export default router;
