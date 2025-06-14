import { sequelize } from '@db/sequelize';
import { User } from './user.model';

export const db = {
    sequelize,
    User,
};

// Optional
export const initDb = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected');
    } catch (err) {
        console.error('Unable to connect to the database:', err);
        throw err; 
    }
};
