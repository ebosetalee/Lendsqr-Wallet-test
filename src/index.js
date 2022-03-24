import app from "./app.js";
import knex from "knex";
import config from "./config/database.js";
import { logger } from "./utils/logger.js";

const port = process.env.PORT || 4400;

async function assertDatabaseConnection(database) {
    return database
        .raw("select 1+1 as result")
        .then(() => {
            logger.info("Connected to Database....");

            logger.info("Initializing Server...");

            app.listen(port, () => {
                logger.info(`server is runnng on port: ${port}`);
            });
        })
        .catch(err => {
            logger.warn("[Fatal] Failed to establish connection to database! Exiting...");
            logger.error(err);

            database.destroy();
            process.exit(1);
        });
}

const knexDB = knex(config);

assertDatabaseConnection(knexDB);

process.on("unhandledRejection", err => {
    logger.error("UNHANDLED REJECTION! 💥 Shutting down...");
    logger.error(err);
    process.exit(1);
});

export default knexDB;
