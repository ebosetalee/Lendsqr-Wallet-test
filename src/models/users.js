import db from "../config/database.js";
import { logger } from "../utils/logger.js";

const TABLE_NAME = "users";

async function createTable() {
    // await db.schema.dropTableIfExists(TABLE_NAME);
    const exists = await db.schema.hasTable(TABLE_NAME);

    if (!exists) {
        return await db.schema
            .createTable(TABLE_NAME, table => {
                table.uuid("id").primary().unique();
                table.string("name");
                table.string("email").unique().notNullable();
                table.bigInteger("account_number").unique().notNullable();
                table.integer("account_balance").defaultTo(0);
                table.timestamps(true, true);
            })
            .then(logger.info("Table created"))
            .catch(logger.error);
    }
}

export default createTable;
