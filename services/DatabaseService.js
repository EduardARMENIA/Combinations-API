
export default class DatabaseService {
    async connect() {
        throw new Error('connect() must be implemented in subclass');
    }

    async query(sql, params) {
        throw new Error('query() must be implemented in subclass');
    }

    async close() {
        throw new Error('close() must be implemented in subclass');
    }
}
