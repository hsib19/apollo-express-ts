import * as appModule from '../src/app';
import { startServer } from '../src/server';

describe('server.ts', () => {
    const listenMock = jest.fn((port, cb) => cb?.());

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should start the server and log success', async () => {
        jest.spyOn(appModule, 'createApp').mockResolvedValue({
            listen: listenMock,
        } as any);

        const logSpy = jest.spyOn(console, 'log').mockImplementation(() => { });

        await startServer(); 

        expect(appModule.createApp).toHaveBeenCalled();
        expect(listenMock).toHaveBeenCalledWith(4000, expect.any(Function));
        expect(logSpy).toHaveBeenCalledWith(
            expect.stringContaining('🚀 Server ready at http://localhost:4000/graphql')
        );

        logSpy.mockRestore();
    });

    it('should log an error if createApp fails', async () => {
        const error = new Error('Create app failed');
        jest.spyOn(appModule, 'createApp').mockRejectedValue(error);

        const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

        await startServer(); 

        expect(appModule.createApp).toHaveBeenCalled();
        expect(errorSpy).toHaveBeenCalledWith('❌ Failed to start server:', error);

        errorSpy.mockRestore();
    });
});
