//@ts-check
import knex from "knex";

const db = knex({
    client: "mysql",
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB,
        insecureAuth: true,
    },
});

export async function assertConnection(database) {
    return database.raw("select 1").toQuery();
}

export default db;
