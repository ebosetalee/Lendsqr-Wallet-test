import asyncHandler from "../middleware/async.js";
import { logger } from "../utils/logger.js";
import { userID, createID } from "../utils/helpers.js";
import { StatusCodes } from "http-status-codes";
import ErrorResponse from "../utils/errors/index.js";
import { generateJwtToken } from "../utils/jwt.js";
import db from "../config/database.js";

const { CREATED, BAD_REQUEST, CONFLICT, NOT_FOUND, OK } = StatusCodes;

export const createUser = asyncHandler(async (req, res) => {
    logger.debug("Creating User Account...");

    const user = req.body;
    const userExists = (await db("users").where("email", user.email))[0];

    if (userExists) {
        throw new ErrorResponse("User Account Already Exists", CONFLICT);
    }
    user.id = userID();
    user.account_number = createID();

    await db("users").insert(user);

    const account = (await db("users").where("id", user.id))[0];
    if (!account) {
        throw new ErrorResponse("Could not create account", BAD_REQUEST);
    }

    res.status(CREATED).json({ message: "Account created successfully", account });
});

export const signIn = asyncHandler(async (req, res) => {
    logger.debug("User signin...");

    const user = (await db("users").where("email", req.email).orWhere("account_number", req.account_number))[0];

    if (!user) {
        throw new ErrorResponse("Account not registered", NOT_FOUND);
    }

    const token = await generateJwtToken(user);

    res.status(OK).json({ message: "Account created successfully", user, token });
});
