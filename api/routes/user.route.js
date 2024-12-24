import express from "express";
import { test } from "../controllers/user.controller.js"
import { deleteUser, signout, updateUser } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
import { generateSignature } from '../controllers/cloudinary.controller.js';
import { getUsers } from '../controllers/user.controller.js';
import { getUser } from '../controllers/user.controller.js';


const router = express.Router();

//router.get("/test", test);
router.put('/update:userId',verifyToken, updateUser);
router.delete('/delete:userId', verifyToken, deleteUser);
router.post('/signout', signout);
router.get('/cloudinary-signature', generateSignature);
router.get('/getusers', verifyToken, getUsers);
router.get('/:userId', getUser);


export default router;








