const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// --- DATABASE PATHS ---
const DB_PATH = path.join(__dirname, '..', 'db');
const USERS_FILE = path.join(DB_PATH, 'users.json');
const LOGBOOKS_FILE = path.join(DB_PATH, 'logbooks.json');
const LETTERS_FILE = path.join(DB_PATH, 'letters.json');
const OPP_FILE = path.join(DB_PATH, 'opportunities.json');
const APPS_FILE = path.join(DB_PATH, 'applications.json');

// --- HELPER FUNCTIONS ---
const readDB = (file) => JSON.parse(fs.readFileSync(file, 'utf8') || '[]');
const saveDB = (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2));

const hashPassword = (password) => crypto.createHash('sha256').update(password).digest('hex');

const generateToken = (user) => {
    const payload = JSON.stringify({ id: user.id, role: user.role, exp: Date.now() + 86400000 });
    return Buffer.from(payload).toString('base64');
};

const parseToken = (token) => {
    try {
        const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
        if (decoded.exp < Date.now()) return null;
        return decoded;
    } catch { return null; }
};

const getRequestBody = (req) => new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => resolve(body ? JSON.parse(body) : {}));
});

const sendJSON = (res, data, status = 200) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.writeHead(status);
    res.end(JSON.stringify(data));
};

// --- ROUTES ---
const server = http.createServer(async (req, res) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.writeHead(204);
        return res.end();
    }

    const { url, method } = req;
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];
    const user = token ? parseToken(token) : null;

    try {
        // --- AUTH ---
        if (url === '/api/auth/signup' && method === 'POST') {
            const body = await getRequestBody(req);
            const users = readDB(USERS_FILE);
            if (users.find(u => u.email === body.email)) return sendJSON(res, { message: 'User exists' }, 400);
            
            const newUser = { ...body, id: Date.now(), password: hashPassword(body.password), status: 'ACTIVE' };
            users.push(newUser);
            saveDB(USERS_FILE, users);
            
            const { password, ...safeUser } = newUser;
            return sendJSON(res, { user: safeUser, token: generateToken(newUser) }, 201);
        }

        if (url === '/api/auth/login' && method === 'POST') {
            const body = await getRequestBody(req);
            const users = readDB(USERS_FILE);
            const found = users.find(u => u.email === body.email && u.password === hashPassword(body.password));
            if (!found) return sendJSON(res, { message: 'Invalid credentials' }, 401);
            
            const { password, ...safeUser } = found;
            return sendJSON(res, { user: safeUser, token: generateToken(found) });
        }

        // --- PROTECTED ROUTES CHECK ---
        if (!user) return sendJSON(res, { message: 'Unauthorized' }, 401);

        // --- USERS ---
        if (url === '/api/users' && method === 'GET') {
            const users = readDB(USERS_FILE);
            const sanitized = users.map(({ password, ...rest }) => rest);
            return sendJSON(res, sanitized);
        }

        if (url === '/api/users/assign-supervisor' && method === 'PATCH') {
            const body = await getRequestBody(req);
            const users = readDB(USERS_FILE);
            const updated = users.map(u => u.id === body.studentId ? { ...u, supervisorId: body.supervisorId } : u);
            saveDB(USERS_FILE, updated);
            return sendJSON(res, { message: 'Assigned' });
        }

        // --- LETTERS ---
        if (url === '/api/letters' && method === 'POST') {
            const body = await getRequestBody(req);
            const letters = readDB(LETTERS_FILE);
            const newLetter = { ...body, id: Date.now(), studentId: user.id, status: 'PENDING', dateSubmitted: new Date().toISOString() };
            letters.push(newLetter);
            saveDB(LETTERS_FILE, letters);
            return sendJSON(res, newLetter, 201);
        }

        if (url === '/api/letters/all' && method === 'GET') {
            const letters = readDB(LETTERS_FILE);
            const users = readDB(USERS_FILE);
            const fullLetters = letters.map(l => ({ ...l, student: users.find(u => u.id === l.studentId) }));
            return sendJSON(res, fullLetters);
        }

        // --- LOGBOOKS ---
        if (url === '/api/logbooks' && method === 'POST') {
            const body = await getRequestBody(req);
            const logs = readDB(LOGBOOKS_FILE);
            const users = readDB(USERS_FILE);
            const me = users.find(u => u.id === user.id);
            
            const newLog = { ...body, id: Date.now(), studentId: user.id, supervisorId: me.supervisorId, status: 'PENDING', date: new Date().toISOString() };
            logs.push(newLog);
            saveDB(LOGBOOKS_FILE, logs);
            return sendJSON(res, newLog, 201);
        }

        if (url === '/api/logbooks/interns-logs' && method === 'GET') {
            const logs = readDB(LOGBOOKS_FILE);
            const myInternsLogs = logs.filter(l => l.supervisorId === user.id);
            return sendJSON(res, myInternsLogs);
        }

        // --- CATCH ALL ---
        return sendJSON(res, { message: 'Not Found' }, 404);

    } catch (err) {
        console.error(err);
        return sendJSON(res, { message: 'Server Error' }, 500);
    }
});

// Seed Initial Admin if no users exist
const users = readDB(USERS_FILE);
if (users.length === 0) {
    users.push({
        id: 1,
        email: 'admin@ims.com',
        password: hashPassword('admin123'),
        name: 'System Admin',
        role: 'ADMIN',
        status: 'ACTIVE'
    });
    saveDB(USERS_FILE, users);
    console.log('🌱 Seeded Admin: admin@ims.com / admin123');
}

const PORT = 5000;
server.listen(PORT, () => {
    console.log(`🚀 STANDALONE BACKEND RUNNING ON http://localhost:${PORT}`);
    console.log('✅ Zero-Dependency Mode Active (No npm install needed)');
});
