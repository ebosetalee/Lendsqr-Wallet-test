import db from "../config/database.js";
import { logger } from "../utils/logger.js";

const TABLE_NAME = "transactions";

async function transactionTable() {
    // await db.schema.dropTableIfExists(TABLE_NAME);
    const exists = await db.schema.hasTable(TABLE_NAME);

    if (!exists) {
        return await db.schema
            .createTable(TABLE_NAME, table => {
                table.uuid("id").primary().unique();
                table.uuid("sender_id");
                table.uuid("receiver_id");
                table.foreign("sender_id", "id").references("users");
                table.foreign("receiver_id", "id").references("users");
                table.integer("amount").notNullable();
            })
            .then(logger.info("Table created"))
            .catch(logger.error);
    }
}

export default transactionTable;
