import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto'; 

const SESSIONS_FILE_PATH = path.resolve('data/sessions.json');

async function readSessions() {
    try {
        const data = await fs.readFile(SESSIONS_FILE_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
       console.error('Failed to read sessions:', error);
        return { sessions: [] };
    }
}
/**
 * @param {any} sessions
 */
async function writeSessions(sessions) {
    try {
        await fs.writeFile(SESSIONS_FILE_PATH, JSON.stringify(sessions, null, 2), 'utf-8');
    } catch (error) {
        console.error('Failed to write sessions:', error);
    }
}

/**
 * @param {any} userId
 */
export async function createSession(userId) {
    const sessions = await readSessions();
    const sessionId = crypto.randomUUID();
    const sessionExpiry = new Date();

    sessionExpiry.setDate(sessionExpiry.getDate() + 1);

    const sessionData = {
        sessionId,
        userId,
        createdAt: new Date().toISOString(),
        expiresAt: sessionExpiry.toISOString() 
    };
    sessions.sessions.push(sessionData);
    await writeSessions(sessions);
    return sessionId;
}

/**
 * @param {string | null | undefined} sessionId
 */
export async function getSession(sessionId) {
    const sessions = await readSessions();
    return sessions.sessions.find((/** @type {{ sessionId: string | null | undefined; }} */ session) => session.sessionId === sessionId);
}

/**
 * @param {any} sessionId
 */
export async function endSession(sessionId) {
    const sessions = await readSessions();
    const index = sessions.sessions.findIndex((/** @type {{ sessionId: any; }} */ session) => session.sessionId === sessionId);
    if (index !== -1) {
        sessions.sessions.splice(index, 1);
        await writeSessions(sessions);
    }
}

/**
 * @param {{ expiresAt: string | number | Date; }} session
 */
export function validateSession(session) {
    const now = new Date();
    const expiresAt = new Date(session.expiresAt);
    return now < expiresAt;
}

