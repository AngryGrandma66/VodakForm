import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto'; // Make sure to import the crypto module

const SESSIONS_FILE_PATH = path.resolve('data/sessions.json');

async function readSessions() {
    try {
        const data = await fs.readFile(SESSIONS_FILE_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        // Handle error (e.g., if the file doesn't exist, return an initial structure)
        console.error('Failed to read sessions:', error);
        return { sessions: [] };
    }
}
async function writeSessions(sessions) {
    try {
        await fs.writeFile(SESSIONS_FILE_PATH, JSON.stringify(sessions, null, 2), 'utf-8');
    } catch (error) {
        // Handle error
        console.error('Failed to write sessions:', error);
    }
}

export async function createSession(userId) {
    const sessions = await readSessions();
    const sessionId = crypto.randomUUID();
    const sessionExpiry = new Date();

    sessionExpiry.setDate(sessionExpiry.getDate() + 1);

    const sessionData = {
        sessionId,
        userId,
        createdAt: new Date().toISOString(),
        expiresAt: sessionExpiry.toISOString() // Add the expiresAt field
    };
    sessions.sessions.push(sessionData);
    await writeSessions(sessions);
    return sessionId;
}

export async function getSession(sessionId) {
    const sessions = await readSessions();
    return sessions.sessions.find(session => session.sessionId === sessionId);
}

export async function endSession(sessionId) {
    const sessions = await readSessions();
    const index = sessions.sessions.findIndex(session => session.sessionId === sessionId);
    if (index !== -1) {
        sessions.sessions.splice(index, 1);
        await writeSessions(sessions);
    }
}

export function validateSession(session) {
    const now = new Date();
    const expiresAt = new Date(session.expiresAt);
    return now < expiresAt;
}

