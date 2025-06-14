import { sequelize } from '../src/db/sequelize';

// Optional: Setup global mocks or variables
beforeAll(async () => {
    await sequelize.authenticate();
});

afterAll(async () => {
    await sequelize.close();
});
