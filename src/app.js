//@ts-check
import "dotenv/config";
import express from "express";

const app = express();

process.on("uncaughtException", err => {
    console.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
    console.error(err);
    process.exit(1);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

export default app;
