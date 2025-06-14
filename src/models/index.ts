import { sequelize } from '../db/sequelize';
import { User, initUserModel } from './user.model';

export const db = {
    sequelize,
    User,
};

export const initDb = async () => {
    try {
        await sequelize.authenticate();

        // init models
        initUserModel(sequelize); 

    } catch (err) {
        console.error('Unable to connect to the database:', err);
        throw err;
    }
};
