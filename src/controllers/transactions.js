import db from "../config/database.js";
import asyncHandler from "../middleware/async.js";
import { logger } from "../utils/logger.js";
import { StatusCodes } from "http-status-codes";
import ErrorResponse from "../utils/errors/index.js";
import { userID } from "../utils/helpers.js";

const { OK, BAD_REQUEST, NOT_FOUND, FORBIDDEN } = StatusCodes;

export const fundAccount = asyncHandler(async (req, res) => {
    logger.debug("Funding User Account...");

    const amount = req.amount;

    const account = (await db("users").where("email", req.user.email))[0];

    const updated = await db("users")
        .where("email", req.user.email)
        .update({ account_balance: account.account_balance + amount });

    if (updated != 1) {
        throw new ErrorResponse("Could not update account", BAD_REQUEST);
    }

    // create transaction
    const details = { id: userID(), receiver_id: req.user.id, amount };
    await db("transactions").insert(details);

    const transaction = (await db("transactions").where("id", details.id))[0];
    const user = (await db("users").where("email", req.user.email))[0];

    res.status(OK).json({ message: "Account funded successfully", user, transaction });
});

export const transferFund = asyncHandler(async (req, res) => {
    logger.debug("Funding another User Account...");

    const amount = req.amount;

    // check account balance is greater than transfer amount
    const currentUser = (await db("users").where("id", req.user.id))[0];

    if (currentUser.account_balance <= amount) {
        throw new ErrorResponse("Insufficient Balance", FORBIDDEN);
    }

    // check account Exists
    const account = (await db("users").where("account_number", req.account_number).orWhere("id", req.id))[0];

    if (!account) {
        throw new ErrorResponse("Account not Available", NOT_FOUND);
    }

    // create transaction
    const details = { id: userID(), sender_id: req.user.id, receiver_id: account.id, amount };
    await db("transactions").insert(details);

    // remove fund from sender account
    const deduct = await db("users")
        .where("id", req.user.id)
        .update({ account_balance: currentUser.account_balance - amount });

    if (deduct != 1) {
        throw new ErrorResponse("Could not deduct from account", BAD_REQUEST);
    }
    // add fund to receiver's account
    const updated = await db("users")
        .where("id", account.id)
        .update({ account_balance: account.account_balance + amount });

    if (updated != 1) {
        throw new ErrorResponse("Could not fund account", BAD_REQUEST);
    }
    const transaction = (await db("transactions").where("id", details.id))[0];
    const user = (await db("users").where("email", req.user.email))[0];

    res.status(OK).json({ message: "Transfer successful", user, transaction });
});

export const withdraw = asyncHandler(async (req, res) => {
    logger.debug("Withdrawal from Account...");

    const amount = req.amount;

    // check account balance is greater than transfer amount
    const currentUser = (await db("users").where("id", req.user.id))[0];

    if (currentUser.account_balance <= amount) {
        throw new ErrorResponse("Insufficient Balance", FORBIDDEN);
    }

    // remove fund from  account
    const deduct = await db("users")
        .where("id", req.user.id)
        .update({ account_balance: currentUser.account_balance - amount });

    if (deduct != 1) {
        throw new ErrorResponse("Could not deduct from account", BAD_REQUEST);
    }

    // create transaction
    const details = { id: userID(), sender_id: req.user.id, amount };
    await db("transactions").insert(details);

    const transaction = (await db("transactions").where("id", details.id))[0];
    const user = (await db("users").where("email", req.user.email))[0];

    res.status(OK).json({ message: "Withdrawal successful", user, transaction });
});
