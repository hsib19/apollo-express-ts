export const env = {
    db: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        pass: process.env.DB_PASS || '',
        name: process.env.DB_NAME || '',
        port: Number(process.env.DB_PORT || 3306),
    },
    app: {
        port: Number(process.env.PORT || 4000),
    },
};
