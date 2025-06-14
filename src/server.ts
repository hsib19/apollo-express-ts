import { createApp } from './app';
import { env } from './config/env'

const PORT = env.app.port;

export async function startServer() {
    try {
        const app = await createApp();
        app.listen(PORT, () => {
            console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
        });
    } catch (err) {
        console.error('❌ Failed to start server:', err);
    }
}

/* istanbul ignore next */
if (require.main === module) {
    startServer();
}
