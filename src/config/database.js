//@ts-check

const config = {
    client: "mysql",
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB,
        insecureAuth: true,
    },
};

export default config;
