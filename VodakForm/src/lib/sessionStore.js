import fs from 'fs/promises';
import path from 'path';

const SESSIONS_FILE_PATH = path.resolve('data/sessions.json');

async function readSessions() {
    const data = await fs.readFile(SESSIONS_FILE_PATH, 'utf-8');
    return JSON.parse(data);
}

async function writeSessions(sessions) {
    await fs.writeFile(SESSIONS_FILE_PATH, JSON.stringify(sessions, null, 2), 'utf-8');
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

