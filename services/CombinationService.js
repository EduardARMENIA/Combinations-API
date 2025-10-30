import MySQLService from './MySQLService.js';

export default class CombinationService extends MySQLService {
    constructor() {
        super()
        this.db = null;
    }

    async connect() {
        try {
            this.db = new MySQLService();
            await this.db.connect();
        } catch (error) {
            throw new Error('Internal server error while connecting to database');
        }
    }

    async generateLetterCombinations(numbers) {
        const rows = await this.db.query('SELECT value FROM letters ORDER BY id ASC');
        const letters = rows.map(row => row.value);
        let result = []

        numbers.forEach((item, index) => {
            for (let i = 0; i < item; i++) {
                result.push(letters[index] + (i + 1))
            }
        })

        return result
    }


    async generateCombinations(data, length) {
        let combinationsWithDublications = []

        data.forEach((item, index) => {
            let next = data.slice(index + 1);

            for (let i = 0; i < next.length; i++) {
                let arr = []

                for (let j = i; j < next.length; j++) {
                    if (j === i) {
                        arr.push(item)
                        if (next[j][0] != arr[arr.length - 1][0]) {
                            arr.push(next[j])
                        }
                    } else {
                        if (next[j][0] != arr[arr.length - 1][0]) {
                            arr.push(next[j])
                        }
                    }
                }

                arr = arr.slice(0, length);

                if (arr.length === length) combinationsWithDublications.push(arr)
            }
        })

        let uniqueCombinations = []

        for (let i = 0; i < combinationsWithDublications.length; i++) {
            let exists = false;

            for (let j = 0; j < uniqueCombinations.length; j++) {
                if (combinationsWithDublications[i][0] === uniqueCombinations[j][0] && combinationsWithDublications[i][1] === uniqueCombinations[j][1]) {
                    exists = true;
                    break;
                }
            }
            if (!exists) {
                uniqueCombinations.push(combinationsWithDublications[i]);
            }
        }

        return uniqueCombinations
    }


    async saveCombinations(items, combinations) {
        const itemResult = await this.db.query(
            'INSERT INTO items (values_json) VALUES (?)',
            [JSON.stringify(items)]
        );
        const itemId = itemResult.insertId;

        const combinationsResult = await this.db.query('INSERT INTO combinations (item_id, combination) VALUES (?, ?)',
            [itemId, JSON.stringify(combinations)]
        );
        const combinationId = combinationsResult.insertId;

        return {
            item_id: itemId,
            combination_id: combinationId,
            items,
            combinations
        };

    }
}

