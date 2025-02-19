import { ClassicLevel } from 'classic-level';
import path from 'path';
import fs from 'fs/promises';

const dbPath = path.resolve(process.cwd(), 'mydb');
let dbInstance = null;

// Cleans up any existing lock files to prevent database access issues.
async function cleanupLockFiles() {
  try {
    const files = await fs.readdir(dbPath);
    await Promise.all(files
      .filter(file => file.endsWith('.LOCK'))
      .map(file => fs.unlink(path.join(dbPath, file)))
    );
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
}

/**
 * Initializes the database instance.
 * Ensures the database is opened before returning it.
 */
export async function getDB() {
  if (dbInstance) return dbInstance;

  await cleanupLockFiles();

  try {
    dbInstance = new ClassicLevel(dbPath, {
      valueEncoding: 'json',
      keyEncoding: 'utf-8',
      compression: false
    });

    await dbInstance.open();
    console.log('Database successfully opened');
    return dbInstance;
  } catch (error) {
    console.error('Failed to open database:', error);
    dbInstance = null;
    throw new Error('Database failed to open');
  }
}

/**
 * Initializes the database with default test data if it does not already exist.
 */
export async function initDB() {
  const db = await getDB();
  try {
    const existingUsers = ['muser1', 'muser2', 'muser3'];
    const exists = await Promise.all(
      existingUsers.map(user => db.get(user).catch(() => false))
    ).then(results => results.every(Boolean));

    if (!exists) {
      const users = {
        muser1: { password: 'mpassword1', blocked: false },
        muser2: { password: 'mpassword2', blocked: false },
        muser3: { password: 'mpassword3', blocked: true }
      };

      const batch = db.batch();
      for (const [key, value] of Object.entries(users)) {
        batch.put(key, value);
      }
      await batch.write();
      console.log('Database initialized with test data');
    }
  } catch (error) {
    console.error('Initialization error:', error);
    throw error;
  }
}

/**
 * Closes the database connection and resets the instance.
 */
export async function cleanup() {
  if (dbInstance) {
    try {
      await dbInstance.close();
      console.log('Database connection closed');
    } catch (error) {
      console.error('Error closing database:', error);
    } finally {
      dbInstance = null;
    }
  }
};

// Ensuring cleanup is performed on process exit events
process.on('exit', cleanup);
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('uncaughtException', cleanup);

export default {
   /**
   * Retrieves a value from the database by key.
   * @param {string} key - The key to retrieve.
   * @returns {Promise<any>} The value associated with the key.
   */
  get: async (key) => {
    const db = await getDB();
    return db.get(key);
  },

  /**
   * Stores a key-value pair in the database.
   * @param {string} key - The key to store the value under.
   * @param {any} value - The value to store.
   * @returns {Promise<void>} A promise that resolves when the operation completes.
   */
  put: async (key, value) => {
    const db = await getDB();
    return db.put(key, value);
  }
};