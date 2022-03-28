// @ts-nocheck
import "dotenv/config";
import express from "express";
import errorHandler from "./middleware/error-handler.js";
import userRoutes from "./routes/user.js";
import transactionRoutes from "./routes/transactions.js";
import createTable from "./models/users.js";
import transactionTable from "./models/transactions.js";

const app = express();

await createTable();
await transactionTable();

process.on("uncaughtException", err => {
    console.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
    console.error(err);
    process.exit(1);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/transaction", transactionRoutes);

app.use(errorHandler);

export default app;
