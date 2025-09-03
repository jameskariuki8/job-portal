import express from "express";
import {deleteUser,getUser,updateUser} from '../../api/controller/user.controller.js'
import { verifyToken } from "../middelware/jwt.js";

const router =express.Router();
router.delete('/:id',verifyToken,deleteUser);
router.get('/:id',verifyToken,getUser);
router.put('/:id',verifyToken,updateUser);
export default router;