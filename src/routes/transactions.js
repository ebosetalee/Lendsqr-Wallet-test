import express from "express";
import { fundAccount, transferFund, withdraw } from "../controllers/transactions.js";
import { FUND, TRANSFER } from "../validation-schema/transactions.js";
import validate from "../middleware/validate.js";
import Auth from "../middleware/auth.js";

const router = express.Router();

router.post("/", Auth, validate(FUND), fundAccount);

router.post("/transfer", Auth, validate(TRANSFER), transferFund);

router.post("/withdraw", Auth, validate(FUND), withdraw);

export default router;
