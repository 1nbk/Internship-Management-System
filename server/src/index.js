const app = require('./app');
const prisma = require('./prisma');

const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        await prisma.$connect();
        console.log('✅ Database connected successfully');
        
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Failed to connect to the database:', error);
        // Don't exit, allow the server to start anyway for debugging
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT} (DEGRADED - No DB)`);
        });
    }
}

startServer();
