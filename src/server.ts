import { createApp } from './app';

const PORT = process.env.PORT || 4000;

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
