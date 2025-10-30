import mysql from 'mysql2/promise';
import DatabaseService from './DatabaseService.js';

export default class MySQLService extends DatabaseService {
    constructor() {
        super();
        this.config = {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        };
        this.connection = null;
    }

    async connect() {
        this.connection = await mysql.createConnection(this.config);
        console.log('Connected to MySQL');
    }

    async query(sql, params = []) {
        if (!this.connection) throw new Error('Database not connected');
        const [rows] = await this.connection.query(sql, params);
        return rows;
    }

    async close() {
        if (this.connection) {
            await this.connection.end();
            console.log('Connection closed');
        }
    }
}
