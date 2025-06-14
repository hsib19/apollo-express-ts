import { sequelize } from '../src/db/sequelize';
import { redisClient } from '../src/config/redis';

beforeAll(async () => {
    await sequelize.authenticate();
});

afterAll(async () => {
    await sequelize.close();

    if (redisClient) {
        await redisClient.quit();
    }
});
