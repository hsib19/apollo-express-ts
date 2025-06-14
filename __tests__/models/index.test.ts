import { initDb } from '../../src/models';
import { sequelize } from '../../src/db/sequelize';

jest.mock('../../src/db/sequelize', () => ({
    sequelize: {
        authenticate: jest.fn(),
    },
}));

jest.mock('../../src/models/user.model', () => ({
    initUserModel: jest.fn(),
    User: jest.fn(),
}));

describe('initDb', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should connect to the database and init models', async () => {
        (sequelize.authenticate as jest.Mock).mockResolvedValue(undefined);
        await initDb();
        expect(sequelize.authenticate).toHaveBeenCalled();
    });

    it('should log error if connection fails', async () => {
        const error = new Error('Connection failed');
        (sequelize.authenticate as jest.Mock).mockRejectedValue(error);

        await expect(initDb()).rejects.toThrow('Connection failed');
        expect(errorSpy).toHaveBeenCalledWith('Unable to connect to the database:', error);
    });
});
