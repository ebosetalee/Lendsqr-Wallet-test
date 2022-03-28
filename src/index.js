import app from "./app.js";
import http from "http";
import db, { assertConnection } from "./config/database.js";
import { logger } from "./utils/logger.js";

async function startServer() {
    const port = process.env.PORT || 4400;

    await assertConnection(db);
    logger.info("Connected to Database....");

    const server = http.createServer(app);
    server.listen(port, () => {
        logger.info(`server is runnng on port: ${port}`);
        logger.info("Initializing Server...");
    });
}

startServer();

process.on("unhandledRejection", err => {
    logger.error("UNHANDLED REJECTION! 💥 Shutting down...\n", err);
    process.exit(1);
});
