import express from "express";
import { createUser, signIn } from "../controllers/user.js";
import { CREATE, SIGNIN } from "../validation-schema/user.js";
import validate from "../middleware/validate.js";

const router = express.Router();

router.post("/", validate(CREATE), createUser);

router.post("/signin", validate(SIGNIN), signIn);

export default router;
